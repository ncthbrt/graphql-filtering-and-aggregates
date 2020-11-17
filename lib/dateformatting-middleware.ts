import { ComposeOutputType, ListComposer, NamedTypeComposer, NonNullComposer, ObjectTypeComposer, ObjectTypeComposerFieldConfig, ScalarTypeComposer, SchemaComposer, ThunkComposer } from "graphql-compose";
import { DateTime, FixedOffsetZone, IANAZone } from "luxon";

function injectArgs(fieldConfig: ObjectTypeComposerFieldConfig<any, any>, composer: SchemaComposer<any>) {
    if (!fieldConfig.args) {
        fieldConfig.args = {};
    }
    fieldConfig.args['dateFormat'] = {
        type: composer.getSTC('String'),
        description: '',
    };

    fieldConfig.args['dateFormatLocale'] = {
        type: composer.getSTC('String'),
        description: '',
    };

    fieldConfig.args['dateFormatTimezone'] = {
        type: composer.getSTC('String'),
        description: '',
    };
}


class NotADate extends Error { }
const NAD = new NotADate;

type DateFormat = string;
type FormatLocale = string;
type FormatTimezone = string;

function baseTransform(value: any, dateFormat?: DateFormat, dateFormatLocale?: FormatLocale, dateFormatTimezone?: FormatTimezone) {
    if (!value) {
        return value;
    }
    let dt: null | DateTime = null;

    if (typeof value === 'string') {
        dt = DateTime.fromISO(value, { zone: FixedOffsetZone.utcInstance });
    } else if (value instanceof Date) {
        dt = DateTime.fromJSDate(value);
    } else {
        return value; // No clue what to do here
    }

    if (!dateFormat && !dateFormatLocale && !dateFormatTimezone) {
        return dt.toUTC();
    }

    if (dateFormatLocale) {
        dt = dt.setLocale(dateFormatLocale);
    }

    if (dateFormatTimezone) {
        const zone = IANAZone.create(dateFormatTimezone);
        dt = dt.setZone(zone);
    }

    if (!dateFormat) {
        return dt.toUTC();
    }
    return dt.toFormat(dateFormat!);
};

function maybeBuildTransform(fieldConfig: ObjectTypeComposerFieldConfig<any, any>, schemaComposer: SchemaComposer<any>, outputType: ComposeOutputType<any> | NamedTypeComposer<any>): ((value: any, dateFormat?: DateFormat, dateFormatLocale?: FormatLocale, dateFormatTimezone?: FormatTimezone) => string) {

    if (outputType.getTypeName() === 'DateTime' && outputType instanceof ScalarTypeComposer) {
        // Field terminates in a Date. Can happily return with the base transformation
        return baseTransform;
    }

    if (outputType instanceof NonNullComposer) {
        let currentOutputType = outputType.getUnwrappedTC();
        // We can just pretty much recurse here. Don't need to do anything for this type modifier
        return maybeBuildTransform(fieldConfig, schemaComposer, currentOutputType);
    }

    if (outputType instanceof ListComposer) {
        let currentOutputType = outputType.getUnwrappedTC();
        // Here have to filter as a list
        // Be careful, very NB to build the function out the closure otherwise you're going to get horrible perf.
        const subtransform = maybeBuildTransform(fieldConfig, schemaComposer, currentOutputType);
        return (currentValue, transform) => {
            if (!transform || !Array.isArray(currentValue)) {
                return currentValue;
            }
            return currentValue.map(x => subtransform(x, transform));
        }
    }

    if (outputType instanceof ThunkComposer) {
        let currentOutputType = outputType.getUnwrappedTC();
        // Thunks. Not too sure. They're really a mystery. Maybe something to do with cavemen.
        // Probably ok to just recurse.
        return maybeBuildTransform(fieldConfig, schemaComposer, currentOutputType);
    }

    // Not a String, or anything that can contain a string. Throw error to signal termination for this type
    throw NAD;
}

function maybeInjectTransform(
    fieldName: string,
    fieldConfig: ObjectTypeComposerFieldConfig<any, any>,
    schemaComposer: SchemaComposer<any>) {
    if (fieldConfig.wasVisited) {
        return;
    }
    fieldConfig.wasVisited = true;
    // Sometimes a particular resolver is not specified, so need to default to 
    // trying to get it from the source (AKA parent)
    if (!fieldConfig.resolve) {
        fieldConfig.resolve = (source) => source && typeof source === 'object' ? source[fieldName] : undefined;
    };

    const outputType = fieldConfig.type;

    // Now recursion happens. We want to check a. that the base type is a Date, 
    // however there are many possible permutation of return type:
    // 
    // For example:
    // List of Maybe Null Dates - [Date]!, 
    // Maybe Null List of Maybe Null Dates - [Date], 
    // List of Dates - [Date!]!, 
    // List of List of Dates - [[String]]
    // 
    // Because I'm lazy, we're going to be using exception handling for control flow. 
    // This is sometimes considered a no-no, largely for performance reasons, however
    // we're only really paying this cost once at start-up, so should be ok. 
    // 
    // To differentiate the exception from actual runtime errors, we will extend 
    // the base error type, calling it `NotADateException`
    // 
    // We also will want to build the transform as we go. Another possible design here would be to do the type check
    // and transformations in multiple passes, which can be the way to go for more complex stuff.
    try {
        const transform = maybeBuildTransform(fieldConfig, schemaComposer, outputType);
        // Is a Date, so can inject the arg 
        injectArgs(fieldConfig, schemaComposer);

        // Want a const ref to the original resolver so that we can use it in the replacement. 
        // Have to be careful because if you don't do this you can stand on your hands 
        // and will get infinite loops as a result.
        const resolver = fieldConfig.resolve;

        fieldConfig.resolve = async (source, args, context, info) => {
            const value = await Promise.resolve(resolver(source, args, context, info));
            return transform(value, typeof args === 'object' ? args['dateFormat'] : undefined, typeof args === 'object' ? args['dateFormatLocale'] : undefined, typeof args === 'object' ? args['dateFormatTimezone'] : undefined);
        }
    } catch (e) {
        if (!(e instanceof NotADate)) {
            throw e;
        } else {
            ; // Do nothing, this field doesn't have strings in it, so don't need to do anything
        }
    }
}


export function injectDateFormattingMiddleware<Composer extends SchemaComposer<unknown>>(composer: Composer) {

    // Iterate over all types, plucking out those that are concrete types
    for (let typeComposer of composer.types.values()) {
        if (!(typeComposer instanceof ObjectTypeComposer)) {
            // Not a concrete type, so no String fields to rewrite
            continue;
        }

        const type = typeComposer.getType();
        for (let fieldName in type.getFields()) {
            let fieldConfig = typeComposer.getField(fieldName);
            maybeInjectTransform(fieldName, fieldConfig, composer);
        }
    }
}
