import { gql, makeExecutableSchema } from 'apollo-server-koa';
import fs from 'fs';
import path from 'path';
import resolvers from './resolvers';
import { SchemaComposer } from 'graphql-compose';
import { injectDateFormattingMiddleware } from '../lib/dateformatting-middleware';

const schemaText = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const unenrichedSchema = makeExecutableSchema({
    typeDefs: gql`${schemaText}`,
    resolvers: resolvers()
});

const composer = new SchemaComposer(unenrichedSchema);

injectDateFormattingMiddleware(composer);


const builtSchema = composer.buildSchema();

export default builtSchema;
