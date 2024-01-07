import { builder } from '../builder';

export const Money = builder.objectRef<Money>('Money');

Money.implement({
	description: 'Objeto que representa uma quantia monetária.',
	fields: (t) => ({
		formatted: t.string({
			description:
				'O valor formatado da quantia monetária no formato de moeda brasileira (BRL).',
			//@ts-ignore
			resolve: (parent: number) => {
				return new Intl.NumberFormat('pt-BR', {
					currency: 'BRL',
					style: 'currency',
				}).format(parent);
			},
		}),
		amount: t.int({
			description: 'O valor numérico da quantia monetária.',
			//@ts-ignore
			resolve: (parent: number) => {
				return parent;
			},
		}),
	}),
});

type Money = {
	formatted: string;
	amount: number;
};
