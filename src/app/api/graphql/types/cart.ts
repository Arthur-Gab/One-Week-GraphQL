import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { builder } from '../builder';
import { GraphQLError } from 'graphql';

builder.mutationField('createCart', (t) =>
	t.prismaField({
		type: 'Cart',
		resolve: async (
			query,
			_,
			__,
			{ db }
		): Promise<{ id: string } | undefined> => {
			try {
				return await db.cart.create({
					data: {},
				});
			} catch (e) {
				if (e instanceof PrismaClientKnownRequestError) {
					// Falha em 'CONSTRAINT UNICA', o ID já está em uso
					if (e.code === 'P2002')
						throw new GraphQLError(
							`Falha na crição do carrinho. Tente outra vez.`,
							{
								extensions: {
									code: `Prisma error: ${e.code}`,
								},
							}
						);
				}
			}
		},
	})
);

builder.prismaObject('Cart', {
	description:
		'Carrinho de compras, contendo seus items, o total de itens e o subtotal da compra',
	fields: (t) => ({
		id: t.exposeID('id'),
		totalItems: t.int({
			resolve: (parent, __, { db }): Promise<number> => {
				console.log(parent);

				// On Progress
				return Promise.resolve(0);
			},
		}),
	}),
});

/**
interface Cart {
	id: string;
	totalItems: number;
	items: [CartItem];
	subTotal: Money;
}
*/
