# GraphQL API - Carrinho de Compras

Esta é uma API GraphQL para gerenciar um carrinho de compras e itens associados.

-   [Pré-requisitos](##Pré-requisitos)
-   [Instalação](##Instalação)
-   [Tipos GraphQL](##Tipos-GraphQL)
    -   [Money](###Money)
    -   [CartItem](###CartItem)
    -   [Cart](###Cart)
-   [Consultas e Mutações](##Consultas-e-Mutações)
    -   [Consultar Carrinho por ID](###Consultar-Carrinho-por-ID)
    -   [Adicionar Item ao Carrinho](###Adicionar-Item-ao-Carrinho)
    -   [Atualizar Quantidade do Item no Carrinho](###Atualizar-Quantidade-do-Item-no-Carrinho)
    -   [Deletar Item do Carrinho](###Deletar-Item-do-Carrinho)
    -   [Criar Novo Carrinho](###Criar-Novo-Carrinho)
-   [Erros Comuns](##Erros-Comuns)
    -   [Falha ao Consultar o Carrinho por ID](###Falha-ao-Consultar-o-Carrinho-por-ID)
    -   [Falha ao Adicionar Item ao Carrinho](###Falha-ao-Adicionar-Item-ao-Carrinho)
    -   [Falha ao Atualizar Quantidade do Item no Carrinho](###Falha-ao-Atualizar-Quantidade-do-Item-no-Carrinho)
    -   [Falha ao Deletar Item do Carrinho](###Falha-ao-Deletar-Item-do-Carrinho)
    -   [Falha ao Criar Novo Carrinho](###Falha-ao-Criar-Novo-Carrinho)

## Pré-requisitos

Certifique-se de ter Node.js e algum gerenciador de pacotes instalado na sua máquina.

## Instalação

1. Clone o repositório:

```bash
   git clone https://github.com/seu-usuario/sua-api-graphql.git
   cd sua-api-graphql
```

2. Instale as dependências:

```bash
   npm install
```

3. Inicie o servidor:

```bash
	npm start
```

O <strong>servidor GraphQL</strong> estará rodando em [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql).
O <strong>Frontend</strong> estará rodando em [http://localhost:3000](http://localhost:3000).

## Tipos GraphQL

### Money

-   `formatted`: Valor formatado da quantia monetária no formato de moeda brasileira (BRL).
-   `amount`: Valor numérico da quantia monetária.

### CartItem

-   `id`: Identificador único do item no carrinho.
-   `name`: Nome do item no carrinho.
-   `description`: Descrição do item no carrinho.
-   `quantity`: Quantidade do item no carrinho.
-   `image`: URL da imagem associada ao item no carrinho.
-   `unitTotal`: Valor total para uma unidade do item no carrinho.
-   `subTotal`: Valor total para a quantidade de itens no carrinho.

### Cart

-   `id`: Identificador único do carrinho de compras.
-   `items`: Lista de itens no carrinho.
-   `itemsCount`: Quantidade total de itens no carrinho.
-   `total`: Subtotal da compra dos itens no carrinho.

## Consultas e Mutações

### Consultar Carrinho por ID

```graphql
query {
	getCartByID(cartId: "seu-id-de-carrinho") {
		id
		items {
			id
			name
			quantity
		}
		itemsCount
		total {
			formatted
		}
	}
}
```

### Adicionar Item ao Carrinho

```graphql
mutation {
	addItemToCart(
		input: {
			cartId: "seu-id-de-carrinho"
			name: "Nome do Item"
			price: 1000
			quantity: 2
			description: "Descrição do Item"
			image: "URL da Imagem"
		}
	) {
		id
		name
		quantity
		unitTotal {
			formatted
		}
		subTotal {
			formatted
		}
	}
}
```

### Atualizar Quantidade do Item no Carrinho

```graphql
mutation {
	updateItemQuantityIntoCart(
		input: {
			cartId: "seu-id-de-carrinho"
			itemId: "seu-id-de-item"
			newItemQuantity: 3
		}
	) {
		id
		name
		quantity
		subTotal {
			formatted
		}
	}
}
```

### Deletar Item do Carrinho

```graphql
mutation {
	deleteItemIntoCart(
		input: { cartId: "seu-id-de-carrinho", itemId: "seu-id-de-item" }
	) {
		id
		name
		quantity
		subTotal {
			formatted
		}
	}
}
```

### Criar Novo Carrinho

```graphql
mutation {
	createCart {
		id
		items {
			id
			name
			quantity
		}
		itemsCount
		total {
			formatted
		}
	}
}
```

## Erros Comuns

### Falha ao Consultar o Carrinho por ID

**Cenário:** O ID do carrinho fornecido não está registrado.
**Mensagem de Erro:**
Falha em encontrar o carrinho. O ID fornecido não está registrado. Tente criar um carrinho antes.

### Falha ao Adicionar Item ao Carrinho

**Cenário:** O ID do carrinho já está em uso.
**Mensagem de Erro:**
Falha em adicionar o Item ao Carrinho. Tente outra vez.

### Falha ao Atualizar Quantidade do Item no Carrinho

**Cenário:** A quantidade mínima permitida é 1.
**Mensagem de Erro:** A atualização da quantidade do item falhou. A quantidade mínima permitida é 1. Para remover o item, utilize outros meios.

**Cenário:** Os IDs informados não são válidos.
**Mensagem de Erro:** Falha ao modificar a quantidade do item. Certifique-se de que os IDs informados são válidos e tente novamente.

### Falha ao Deletar Item do Carrinho

**Cenário:** Os IDs informados não são válidos.
**Mensagem de Erro:** Falha ao deletar o item. Certifique-se de que os IDs informados são válidos e tente novamente.

**Cenário:** O item não foi encontrado.
**Mensagem de Erro:** Falha ao deletar o item. Certifique-se de que os IDs informados são válidos e tente novamente.

### Falha ao Criar Novo Carrinho

**Cenário:** O ID do novo carrinho já está em uso.
**Mensagem de Erro:** Falha na criação do carrinho. Tente outra vez.

**Cenário:** Ocorreu um erro inesperado.
**Mensagem de Erro:** Ocorreu um erro inesperado. Tente outra vez.
