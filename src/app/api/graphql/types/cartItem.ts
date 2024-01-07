import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { builder } from '../builder';
import { Money } from './money';
import { GraphQLError } from 'graphql/error/GraphQLError';

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
			nullable: true, // Remover após a implementação
			resolve: (parent) => {
				return parent.price;
			},
		}),
		subTotal: t.field({
			type: Money,
			description: 'Valor total para a quantidade de itens no carrinho.',
			nullable: true, // Remover após a implementação
			resolve: (parent) => {
				return parent.price * parent.quantity;
			},
		}),
	}),
});

/**
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
