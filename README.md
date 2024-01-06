# Pothos not passing include on Query

No meu <strong>prismaObject</strong> do [Cart](./src/app/api/graphql/types/cart.ts) estou adicionado a seguinte linha, no entanto, a propriedade <strong>\_count</strong> não está sendo passada corretamente para os <strong>query</strong> e nos resolvers ao utilizar um <strong>parent.\_count</strong>, recebo um erro de <strong>undefined</strong>.

```bash
include:  {  items:  true,  _count:  true  }
```

## Contexto

```bash
generator  client {
	provider =  "prisma-client-js"
}



// Generate types for my builder
generator  pothos {
	provider =  "prisma-pothos-types"
}



datasource  db {
	provider =  "postgresql"
	url =  env("POSTGRES_PRISMA_URL") // uses connection poolings
	directUrl =  env("POSTGRES_URL_NON_POOLING") // uses a direct connection
}



model  Cart {
	id String  @id  @default(uuid())
	items CartItem[]
}



model  CartItem {
	id String  @default(uuid())
	name String
	description String?
	price Int
	quantity Int
	image String?

	Cart Cart  @relation(fields: [cartId], references: [id], onDelete: Cascade)
	cartId String

	@@id([id, cartId])
}
```

## O que essa linha deveria fazer?

1.  Passar as chaves e valores definidos no include para os parametros <strong>"query"</strong>, como no exemplo abaixo

```bash

resolve:  async (query, __, { input: { cartId } }, { db }) => {

```

2. Tornar possível adicionar o valor do query nas requisições do prisma

```bash

const findedCart =  await db.cart.findUniqueOrThrow({
	...query,
	// and so on
}

```

3. Adicionar aos <strong>"parent"</strong> a tipagem das chaves, valores definidas no include, por exemplo:

```bash
items: t.prismaField({
	description:  'Items adicionados ao carrinho.',
	type: ['CartItem'],
	nullable: {
		list:  false,
		items:  true,
	},
	resolve:  async (_, parent) => {
		return parent.items; // Essa tipagem
	},
}),
```

## O que deu errado?

No meu include, estou passando <strong>\_count</strong>

```bash
include:  {  items:  true,  _count:  true  }
```

No entanto ele não está sendo passado para o <strong>query</strong> nos resolvers, vocês podem verificar essa ocorrência, no arquivo [cart.ts](./src/app/api/graphql/types/cart.ts) na linha 52 aonde executo o seguinte console.log

```bash
console.log(query); // Retonar somente {include: {items: true} } -- Linha 52

const findedCart =  await db.cart.findUniqueOrThrow({
	...query,
	where: {
	id: cartId,
};
```
