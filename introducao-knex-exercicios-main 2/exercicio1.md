# Exerício 1
Configure seu servidor Express para que ele se comunique com seu banco de dados via knex e refatore (ou recrie) os seguintes endpoints:

## Get All Users
- method HTTP (GET)
- path ("/users")
- response
    - status 200
    - array de users do arquivo .db

## Get All Products
- method HTTP (GET)
- path ("/products")
- response
    - status 200
    - array de products do arquivo .db

## Search Product by name
- method HTTP (GET)
- path ("/product/search")
- query params
    - q
- response
    - status 200
    - array do resultado da busca no arquivo .db
