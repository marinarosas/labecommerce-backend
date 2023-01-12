# Exercício 1
Hoje nosso foco será **refatorar** nossos endpoints do Labecommerce e torná-los mais robustos e preparados para lidar com erros.

## Get All Users
- não precisa de validação, basta refatorar para o uso do try/catch

## Get All Products
- não precisa de validação, basta refatorar para o uso do try/catch

## Search Product by name
- query params deve possuir pelo menos um caractere

## Create User
- validar o body
- extra:
    - não deve ser possível criar mais de uma conta com a mesma id
    - não deve ser possível criar mais de uma conta com o mesmo e-mail

## Create Product
- validar o body
- extra:
    - não deve ser possível criar mais de um produto com a mesma id

## Create Purchase
- validar o body
- extra:
    - id do usuário que fez a compra deve existir no array de usuários cadastrados
    - id do produto que foi comprado deve existir no array de produtos cadastrados
    - a quantidade e o total da compra devem estar com o cálculo correto
