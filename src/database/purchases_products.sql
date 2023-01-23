-- Active: 1673889528617@@127.0.0.1@3306

--## Criação da tabela de relações
-- - nome da tabela: **purchases_products**
-- - colunas da tabela:
--   - purchase_id (TEXT e obrigatório, não deve ser único)
--   - product_id (TEXT e obrigatório, não deve ser único)
--   - quantity (INTEGER e obrigatório, não deve ser único)
CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

SELECT * FROM purchases_products;

-- ## Inserção dos dados
-- Popule sua tabela purchases_products simulando 3 compras de clientes.<br>
INSERT INTO purchases_products(purchase_id, product_id, quantity)
VALUES
    ('pr001', 'p001', 2),
    ('pr002', 'p002', 2),
    ('pr003', 'p003', 1),
    ('pr004', 'p004', 3),
    ('pr005', 'p001', 1),
    ('pr006', 'p004', 1);

-- ## Consulta com junção INNER JOIN
-- Mostre em uma query todas as colunas das tabelas relacionadas (purchases_products, purchases e products).
SELECT * FROM purchases_products
INNER JOIN purchases ON purchases_products.purchase_id = purchases.id
INNER JOIN products ON purchases_products.product_id = products.id;

SELECT 
    purchases_products.purchase_id AS purchaseId,
    purchases_products.quantity AS purchaseProductQuantity,
    purchases.buyer AS purchasesBuyer,
    purchases.total_price AS purchaseTotalPrice,
    purchases.created_at AS purchaseDate,
    purchases.paid AS purchasePaid,
    products.id AS productId,
    products.name AS productName,
    products.description AS productDescription,
    products.image_url AS productImage
 FROM purchases_products
INNER JOIN purchases ON purchases_products.purchase_id = purchases.id
INNER JOIN products ON purchases_products.product_id = products.id;