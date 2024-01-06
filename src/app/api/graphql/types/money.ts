import { builder } from '../builder';

export const Money = builder.objectRef<Money>('Money');

Money.implement({
	description: ``,
	fields: (t) => ({
		formatted: t.string({
			nullable: true, // Remove After implementation
			resolve: (parent) => {
				console.log(`Parent on money_formatted: `, parent);

				return null;
			},
		}),
		amount: t.int({
			nullable: true, // Remove After implementation
			resolve: (parent) => {
				console.log(`Parent on money_amount: `, parent);

				return null;
			},
		}),
	}),
});

type Money = {
	formatted: string;
	amount: number;
};
