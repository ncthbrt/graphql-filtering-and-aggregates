import { gql, makeExecutableSchema } from 'apollo-server-koa';
import fs from 'fs';
import path from 'path';
import resolvers from './resolvers';
import { SchemaComposer } from 'graphql-compose';
import { injectAggregatesMiddleware } from '../lib/aggregate-middleware';

const schemaText = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const composer = new SchemaComposer();


const unenrichedSchema = makeExecutableSchema({
    typeDefs: gql`${schemaText}`,
    resolvers: resolvers()
});

composer.merge(unenrichedSchema);
injectAggregatesMiddleware(composer);


const builtSchema = composer.buildSchema();

export default builtSchema;
