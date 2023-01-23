# Exercício 2
Mesmo fluxo do exercício 1.

## Create User
- method HTTP (POST)
- path ("/users")
- body
    - id
    - name
    - email
    - password
    - createdAt
- response
    - status 201
    - "Cadastro realizado com sucesso"

## Create Product
- method HTTP (POST)
- path ("/products")
- body
    - id
    - name
    - price
    - description
    - imageUrl
- response
    - status 201
    - "Produto cadastrado com sucesso"

## Create Purchase
- method HTTP (POST)
- path ("/purchases")
- body
    - id
    - buyer
    - totalPrice
    - createdAt
    - paid
    
- response
    - status 201
    - "Compra cadastrada com sucesso"
