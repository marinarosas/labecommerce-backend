# Exercício 2
Agora podemos praticar a manipulação de arrays e objetos!<br>
No arquivo database.ts temos os mocks dos dados da aplicação, mas por enquanto eles estão totalmente inérteis e sem dinamicidade.<br>

## Funcionalidades
Desenvolva uma função para cada funcionalidade. Você pode colocá-las no arquivo database.ts.<br>
Chame cada uma no index.ts e verifique se estão funcionando dando console.log.<br>
Não se preocupe em validar os dados por enquanto, desenvolva apenas os casos de sucesso (caminho feliz).

### User
- createUser (cria uma nova pessoa na lista de users)
    - input: três parâmetros (id, email e password)
    - output: frase de sucesso ("Cadastro realizado com sucesso")
    - exemplo de chamada:
        ```createUser("u003", "beltrano@email.com", "beltrano99")```
- getAllUsers (busca todas as pessoas da lista de users)
    - input: nenhum
    - output: lista atualizada de users
    - exemplo de chamada:
        ```getAllUsers()```

### Product
- createProduct (cria um novo produto na lista de products)
    - input: três parâmetros (id, name, price e category)
    - output: frase de sucesso ("Produto criado com sucesso")
    - exemplo de chamada:
        ```createProduct("p004", "Monitor HD", 800, PRODUCT_CATEGORY.ELECTRONICS)```
- getAllProducts (busca todos os produtos da lista de products)
    - input: nenhum
    - output: lista atualizada de products
    - exemplo de chamada:
        ```getAllProducts()```
- getProductById (busca por produtos baseado em um id da lista de products)
    - input: um parâmetro (idToSearch)
    - output: o produto encontrado ou undefined
    - exemplo de chamada:
        ```getProductById("p004")```
