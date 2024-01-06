import { builder } from './builder';

// Used for print my schime in a .graphql
import { lexicographicSortSchema, printSchema } from 'graphql';
import { writeFileSync } from 'fs';

// Import here all the typesDefs and Resolvers
import './types/cart';
import './types/cartItem';
import './types/money';

export const schema = builder.toSchema();

const schemaAsString = printSchema(lexicographicSortSchema(schema));
writeFileSync(`${process.cwd()}/schema.graphql`, schemaAsString);
