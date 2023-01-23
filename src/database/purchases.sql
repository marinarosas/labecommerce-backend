-- Active: 1674045279687@@127.0.0.1@3306

-- ## Criação da tabela de **pedidos**
-- - nome da tabela: **purchases**
-- - colunas da tabela:
--   - id (TEXT, PK, único e obrigatório)
--   - total_price (REAL, único e obrigatório)
--   - paid (INTEGER e obrigatório)
--   - delivered_at (TEXT e opcional)
--   - buyer_id (TEXT, obrigatório e FK = referencia a coluna id da tabela users)
CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NO NULL,
    total_price REAL NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL,
    paid INTEGER DEFAULT(0) NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
);

SELECT * FROM purchases;
DROP TABLE purchases;

--## a) Crie dois pedidos para cada usuário cadastrado
INSERT INTO purchases(id, buyer, total_price, paid)
VALUES
    ('pr001', 'u001', 300, 1),
    ('pr002', 'u001', 80, 1),
    ('pr003', 'u002', 5000, 1),
    ('pr004', 'u002', 60, 1),
    ('pr005', 'u003', 150, 1),
    ('pr006', 'u003', 20, 1);

--## b) Edite o status da data de entrega de um pedido
UPDATE purchases
SET 
    delivered_at = DATETIME('now')
WHERE id = 'pr004';

UPDATE purchases
SET total_price = 9.90
WHERE id = 'pr004';

SELECT * FROM users
INNER JOIN purchases
ON purchases.buyer = users.id
WHERE users.id = 'u001';

SELECT 
    users.id AS userId,
    users.name AS userName,
    users.email AS userEmail,
    users.password AS userPassword,
    users.created_at AS userCreatAt,
    purchases.id AS purchaseId,
    purchases.total_price AS purchaseTotalPrice,
    purchases.created_at AS purchaseCreatAt,
    purchases.paid AS purchasePaid
 FROM users
INNER JOIN purchases
ON purchases.buyer = users.id
WHERE users.id = 'u001';