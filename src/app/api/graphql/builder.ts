import SchemaBuilder from '@pothos/core';
import { type MyContext } from './route';

//Plugins
import WithInputPlugin from '@pothos/plugin-with-input';

import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import db from '@/lib/db';

export const builder = new SchemaBuilder<{
	PrismaTypes: PrismaTypes;
	Scalars: {
		ID: { Input: String; Output: String };
	};
	Context: MyContext;
}>({
	plugins: [PrismaPlugin, WithInputPlugin],
	prisma: {
		client: db,
	},
});
/////aaaaaa
// Hello World from server
builder.queryType({
	fields: (t) => ({
		greetings: t.string({
			resolve: () => 'Hello, from GraphQL on Next 14',
		}),
	}),
});
builder.mutationType({});
