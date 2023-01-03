# Exercício 3
Com as tipagens desenvolvidas, agora podemos criar alguns dados mock (de mentirinha, mas verdadeiramente estruturados).
- crie o arquivo database.ts dentro da pasta src
    - iremos criar um array para cada entidade e exportá-los

## user
- no database.ts, crie e exporte a constante users e tipe-a como um array do type respectivo criado no exercício 2
    - lembre-se de referenciar o material assíncrono
- crie pelo menos 2 objetos nesse array

## product
- no database.ts, crie e exporte a constante products e tipe-a como um array do type respectivo criado no exercício 2
    - lembre-se de referenciar o material assíncrono
- crie pelo menos 2 objetos nesse array

## purchase
- no database.ts, crie e exporte a constante purchases e tipe-a como um array do type respectivo criado no exercício 2
    - lembre-se de referenciar o material assíncrono
- crie pelo menos 2 objetos nesse array
    - garanta que o userId preenchido exista na constante users
    - garanta que o productId preenchido exista na constante products
    - garanta que o cálculo do totalPrice esteja de acordo com a quantity da compra

# Para finalizar
Vá para o index.ts e importe as constantes users, products e purchases.
Coloque um console.log para cada e rode a aplicação com o script de start para ver se deu tudo certo!
