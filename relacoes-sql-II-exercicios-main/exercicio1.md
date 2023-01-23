# Exercício 1
Agora que sabemos como criar relações m:n, é possível implementar a tabela de relações entre produtos e pedidos.<br>

## Criação da tabela de relações
- nome da tabela: **purchases_products**
- colunas da tabela:
  - purchase_id (TEXT e obrigatório, não deve ser único)
  - product_id (TEXT e obrigatório, não deve ser único)
  - quantity (INTEGER e obrigatório, não deve ser único)

### Como essa lógica funciona?
Cada compra é registrada uma única vez na tabela purchases. <br>
Cada produto da mesma compra é registrado uma única vez na tabela purchases_products. <br>
Exemplo:
- uma pessoa coloca 5 laranjas (p001) e 3 bananas (p002) no carrinho e confirma sua compra

- a compra é registrada com id c001 na tabela purchases
  - a seguir, cada item do carrinho é registrado na tabela purchases_products
    - 5 laranjas são registradas na tabela purchases_products (c001, p001, 5)
    - 3 bananas são registradas na tabela purchases_products (c001, p002, 3)
