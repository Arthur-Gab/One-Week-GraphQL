import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { builder } from '../builder';
import { GraphQLError } from 'graphql';

builder.mutationField('createCart', (t) =>
	t.prismaField({
		type: 'Cart',
		resolve: async (query, _, __, { db }) => {
			try {
				return await db.cart.create({
					data: {},
				});
			} catch (e) {
				if (
					e instanceof PrismaClientKnownRequestError &&
					e.code === 'P2002'
				) {
					// Falha em 'CONSTRAINT UNICA', o ID já está em uso
					throw new GraphQLError(
						`Falha na crição do carrinho. Tente outra vez.`,
						{
							extensions: {
								code: `Prisma error: ${e.code}`,
							},
						}
					);
				} else {
					console.error(e);
					throw new GraphQLError(
						'Ocorreu um erro inesperado. Tente outra vez.'
					);
				}
			}
		},
	})
);

builder.queryField('getCartByID', (t) =>
	t.prismaFieldWithInput({
		description: ``,
		input: {
			cartId: t.input.id({ required: true }),
		},
		type: 'Cart',
		nullable: true,
		resolve: async (query, _, { input: { cartId } }, { db }) => {
			try {
				const findedCart = await db.cart.findUniqueOrThrow({
					where: {
						id: cartId,
					},
				});

				return findedCart;
			} catch (e) {
				if (
					e instanceof PrismaClientKnownRequestError &&
					e.code === 'P2025'
				) {
					throw new GraphQLError(
						'Falha em encontrar o carrinho. O ID fornecido não está registrado. Tente criar um carrinho antes.',
						{
							extensions: {
								code: `Prisma error: ${e.code}`,
							},
						}
					);
				} else {
					console.error(e);
					throw new GraphQLError(
						'Ocorreu um erro inesperado. Tente outra vez.'
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
