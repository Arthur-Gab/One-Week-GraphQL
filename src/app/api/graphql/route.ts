import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { type PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

// Prisma Client instancia
import db from '@/lib/db';

export type MyContext = {
	db: PrismaClient;
};

const createContext = async (): Promise<MyContext> => ({
	db,
});

const { handleRequest } = createYoga<{
	req: NextApiRequest;
	res: NextApiResponse;
}>({
	schema,
	graphqlEndpoint: '/api/graphql',
	fetchAPI: { Response },
	context: createContext(),
});

export {
	handleRequest as GET,
	handleRequest as POST,
	handleRequest as OPTIONS,
};
