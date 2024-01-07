import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { builder } from '../builder';
import { GraphQLError } from 'graphql';
import { Money } from './money';

builder.mutationField('createCart', (t) =>
	t.prismaField({
		description: 'Mutação para criar um novo carrinho de compras.',
		type: 'Cart',
		resolve: async (_, __, ___, { db }) => {
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
		description:
			'Consulta para obter um carrinho de compras com base no ID.',
		input: {
			cartId: t.input.id({
				required: true,
				description: 'ID do carrinho de compras.',
			}),
		},
		type: 'Cart',
		nullable: true,
		resolve: async (query, _, { input: { cartId } }, { db }) => {
			try {
				const findedCart = await db.cart.findUniqueOrThrow({
					...query,
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
	// Add include to query on resolvers and type parent with these types
	include: { items: true },
	fields: (t) => ({
		id: t.exposeID('id', {
			description: 'Identificador unico do Carrinho',
		}),
		items: t.prismaField({
			description: 'Items adicionados ao carrinho.',
			type: ['CartItem'],
			nullable: {
				list: false,
				items: true,
			},
			resolve: async (_, parent) => {
				return parent.items;
			},
		}),
		itemsCount: t.int({
			description: 'Quantidade Total de Itens adicionado ao carrinho',
			resolve: async (parent) => {
				return parent.items.reduce((count: number, item) => {
					return (count += item.quantity);
				}, 0);
			},
		}),
		total: t.field({
			description: 'Subtotal da compra dos itens adicionados ao carrinho',
			type: Money,
			resolve: async (parent) => {
				return parent.items.reduce((count: number, item) => {
					return (count += item.quantity * item.price);
				}, 0);
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
