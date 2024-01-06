import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { builder } from '../builder';
import { GraphQLError } from 'graphql';
import { Money } from './money';
import { Cart } from '@prisma/client';
import { includeForRefMap } from '@pothos/plugin-prisma/dts/util/datamodel';
import { prismaModelName } from '@pothos/plugin-prisma';

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
		resolve: async (query, __, { input: { cartId } }, { db }) => {
			try {
				console.log(query);

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
	include: { items: true, _count: true },
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
		totalItems: t.int({
			description: 'Quantidade Total de Itens adicionado ao carrinho',
			resolve: async (parent) => {
				// console.log(parent);
				//@ts-ignore
				// return parent._count.items;

				return 0;
			},
		}),
		// subTotal: t.field({
		// 	description: 'Subtotal da compra dos itens adicionados ao carrinho',
		// 	type: Money,
		// 	nullable: true,
		// 	resolve: async (parent) => {
		// 		return parent.items.reduce();
		// 	},
		// }),
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
