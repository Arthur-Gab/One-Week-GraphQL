import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { builder } from '../builder';
import { Money } from './money';
import { GraphQLError } from 'graphql/error/GraphQLError';
import z from 'zod';

builder.mutationField('addItemToCart', (t) =>
	t.prismaFieldWithInput({
		description: 'Mutação para adicionar um item ao carrinho de compras.',
		input: {
			cartId: t.input.id({
				required: true,
				description: 'ID do carrinho de compras.',
			}),
			name: t.input.string({
				required: true,
				description: 'Nome do item.',
			}),
			price: t.input.int({
				required: true,
				description: 'Preço do item.',
			}),
			quantity: t.input.int({
				required: true,
				description: 'Quantidade do item.',
			}),
			description: t.input.string({ description: 'Descrição do item.' }),
			image: t.input.string({
				description: 'URL da imagem associada ao item.',
			}),
		},
		type: 'CartItem',
		nullable: true,
		resolve: async (query, _, { input }, { db }) => {
			try {
				const addedItem = await db.cartItem.create({
					data: {
						...input,
					},
				});

				return addedItem;
			} catch (e) {
				if (
					e instanceof PrismaClientKnownRequestError &&
					e.code === 'P2002'
				) {
					// Falha em 'CONSTRAINT UNICA', o ID já está em uso
					throw new GraphQLError(
						`Falha em adicionar o Item ao Carrinho. Tente outra vez.`,
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

builder.mutationField('updateItemQuantityIntoCart', (t) =>
	t.prismaFieldWithInput({
		description:
			'Mutação para atualizar a quantidade de um item no carrinho de compras.',
		input: {
			cartId: t.input.id({
				required: true,
				description: 'ID do carrinho de compras.',
			}),
			itemId: t.input.id({
				required: true,
				description: 'ID do item no carrinho.',
			}),
			newItemQuantity: t.input.int({
				required: true,
				description: 'Nova quantidade desejada do item.',
			}),
		},
		type: 'CartItem',
		//@ts-ignore
		resolve: async (_, __, { input }, { db }) => {
			try {
				const isnewItemQuantityValid = z
					.number()
					.min(1)
					.safeParse(input.newItemQuantity);

				if (!isnewItemQuantityValid.success) {
					throw new GraphQLError(
						`A atualização da quantidade do item falhou. A quantidade mínima permitida é 1. Para remover o item, utilize outros meios.`
					);
				}

				return await db.cartItem.update({
					where: {
						id_cartId: {
							id: input.itemId,
							cartId: input.cartId,
						},
					},
					data: {
						quantity: input.newItemQuantity,
					},
				});
			} catch (e) {
				if (
					e instanceof PrismaClientKnownRequestError &&
					e.code === 'P2025'
				) {
					throw new GraphQLError(
						`Falha ao modificar a quantidade do item. Certifique-se de que os IDs informados são válidos e tente novamente.`,
						{
							extensions: {
								code: `Prisma Error: ${e.code}`,
							},
						}
					);
				}
			}
		},
	})
);

builder.mutationField('deleteItemIntoCart', (t) =>
	t.prismaFieldWithInput({
		description: 'Mutação para deletar um item no carrinho de compras.',
		input: {
			cartId: t.input.id({
				required: true,
				description: 'ID do carrinho de compras.',
			}),
			itemId: t.input.id({
				required: true,
				description: 'ID do item no carrinho.',
			}),
		},
		type: 'CartItem',
		//@ts-ignore
		resolve: async (_, __, { input }, { db }) => {
			try {
				return await db.cartItem.delete({
					where: {
						id_cartId: {
							id: input.itemId,
							cartId: input.cartId,
						},
					},
				});
			} catch (e) {
				if (
					e instanceof PrismaClientKnownRequestError &&
					e.code === 'P2025'
				) {
					throw new GraphQLError(
						`Falha ao deletear o item. Certifique-se de que os IDs informados são válidos e tente novamente.`,
						{
							extensions: {
								code: `Prisma Error: ${e.code}`,
							},
						}
					);
				}
			}
		},
	})
);

builder.prismaObject('CartItem', {
	description: 'Objeto que representa um item no carrinho de compras.',
	fields: (t) => ({
		id: t.exposeID('id', {
			description: 'Identificador único do item no carrinho.',
		}),
		name: t.exposeString('name', {
			description: 'Nome do item no carrinho.',
		}),
		description: t.exposeString('description', {
			description: 'Descrição do item no carrinho.',
			nullable: true,
		}),
		quantity: t.exposeInt('quantity', {
			description: 'Quantidade do item no carrinho.',
		}),
		image: t.exposeString('image', {
			description: 'URL da imagem associada ao item no carrinho.',
			nullable: true,
		}),
		unitTotal: t.field({
			type: Money,
			description: 'Valor total para uma unidade do item no carrinho.',
			//@ts-ignore
			resolve: (parent) => {
				return parent.price || 0;
			},
		}),
		subTotal: t.field({
			type: Money,
			description: 'Valor total para a quantidade de itens no carrinho.',
			//@ts-ignore
			resolve: (parent) => {
				return parent.price * parent.quantity || 0;
			},
		}),
	}),
});

/*
interface CartItem {
	id: string;
	name: string;
	description: string;
	subTotal: Money;
	lineTotal: Money;
	quantity: number;
	image: string;
}
*/
