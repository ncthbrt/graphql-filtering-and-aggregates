import { GraphQLObjectType } from "graphql";
import { SchemaComposer, ObjectTypeComposer } from "graphql-compose";


function maybeInjectAggregates(typeComposer: ObjectTypeComposer, _schemaComposer: SchemaComposer<any>) {
    const type: GraphQLObjectType & { __wasVisitedByAggregateExtension?: boolean } = typeComposer.getType();

    if (type.__wasVisitedByAggregateExtension) {
        return;
    }
    type.__wasVisitedByAggregateExtension = true;

    // Doesn't have the injectAggregate directive. Return early
    if (!typeComposer.getDirectiveByName('injectAggregate')) {
        return;
    }
}

export function addInjectAggregateDirective<Composer extends SchemaComposer<unknown>>(composer: Composer) {
    composer.addTypeDefs(`
        """
        If this directive is included on an connection, it'll automatically add aggregate resolvers to the connection.
        """
        directive @injectAggregate on    
        | OBJECT
    `);
}

export function injectAggregatesMiddleware<Composer extends SchemaComposer<unknown>>(composer: Composer) {
    // Iterate over all types, plucking out those that are concrete types
    for (let typeComposer of composer.types.values()) {
        if (!(typeComposer instanceof ObjectTypeComposer)) {
            // Not a concrete type, so nothing to do
            continue;
        }
        maybeInjectAggregates(typeComposer, composer);
    }
}
