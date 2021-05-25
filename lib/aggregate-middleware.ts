import { GraphQLList, GraphQLObjectType } from "graphql";
import { SchemaComposer, ObjectTypeComposer, ListComposer, NonNullComposer, NamedTypeComposer } from "graphql-compose";


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

    const edgesField = typeComposer.getField('edges');
    if (!edgesField) {
        console.warn('injectAggregate requires that the type it is specified on has edges');
        return;
    }

    let edgesType = edgesField.type;
    let edgeType: NamedTypeComposer<any>;
    if (edgesType instanceof NonNullComposer) {
        if (!(edgesType.getType() instanceof GraphQLList)) {
            console.warn('injectAggregate requires that the type it is specified is has an edge field made up of a list of edges');
            return;
        }
        edgeType = edgesType.getUnwrappedTC();
    } else if (edgesType instanceof ListComposer) {
        edgeType = edgesType.getUnwrappedTC();
    } else {
        console.warn('injectAggregate requires that the type it is specified is has an edge field made up of a list of edges');
        return;
    }

    // Need to validate that the edge type conforms to the relay spec.
    // This means it must be an object, and that it needs a node field
    if (!(edgeType instanceof ObjectTypeComposer)) {
        console.warn('injectAggregate requires that type of edges conforms to the relay spec. We have detected a non-object edge');
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
