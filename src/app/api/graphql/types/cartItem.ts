import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { builder } from '../builder';
import { Money } from './money';
import { GraphQLError } from 'graphql/error/GraphQLError';

builder.mutationField('addItemToCart', (t) =>
	t.prismaFieldWithInput({
		description: ``,
		input: {
			cartId: t.input.id({ required: true }),
			name: t.input.string({ required: true }),
			price: t.input.int({ required: true }),
			quantity: t.input.int({ required: true }),
			description: t.input.string(),
			image: t.input.string(),
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
	description: ``,
	fields: (t) => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		description: t.exposeString('description', {
			nullable: true,
		}),
		quantity: t.exposeInt('quantity'),
		image: t.exposeString('image', {
			nullable: true,
		}),
		unitTotal: t.field({
			type: Money,
			nullable: true, // Remove After implementation
			resolve: (parent) => {
				console.log(`Parent on cartItem_unitTotal`, parent);

				return null;
			},
		}),
		subTotal: t.field({
			type: Money,
			nullable: true, // Remove After implementation
			resolve: (parent) => {
				console.log(`Parent on cartItem_subTotal`, parent);

				return null;
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
