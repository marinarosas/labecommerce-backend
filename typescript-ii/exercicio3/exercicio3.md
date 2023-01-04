# Exercício 3
Mesmo fluxo que o exercício 2.<br>

## Funcionalidades
Desenvolva uma função para cada funcionalidade.

### Product
- queryProductsByName (busca por produtos baseado em um nome da lista de products)
    - input: um parâmetro (q)
        - q é a abreviação de query (termo de busca/consulta)
    - output: lista de produtos com nomes que contenham o termo de busca
    - extra: o resultado da busca deve ser case insensitive
    - exemplo de chamada:
        ```queryProductsByName("monitor")```

### Purchase
- createPurchase (cria uma nova compra na lista de purchases)
    - input: quatro parâmetros (userId, productId, quantity e totalPrice)
    - output: frase de sucesso ("Compra realizada com sucesso")
    - exemplo de chamada:
        ```createPurchase("u003", "p004", 2, 1600)```
- getAllPurchasesFromUserId (busca todas as compras feitas baseado no id do usuário)
    - input: userIdToSearch
    - output: lista atualizada de compras nas quais o userId delas são do userIdToSearch
    - exemplo de chamada:
        ```getAllPurchasesFromUserId("u003")```
