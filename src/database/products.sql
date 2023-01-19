-- Active: 1673889528617@@127.0.0.1@3306

-- ## a) Criação da tabela de **produtos**
-- - nome da tabela: **products**
-- - colunas da tabela:
--   - id (TEXT, PK, único e obrigatório)
--   - name (TEXT e obrigatório)
--   - price (REAL e obrigatório)
--   - category (TEXT e obrigatório)
CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL, 
    image_url TEXT NOT NULL
);

--## Get All Products
SELECT * FROM products;

-- ## Get All Products versão 1
-- - retorna o resultado ordenado pela coluna price em ordem crescente
-- - limite o resultado em 20 iniciando pelo primeiro item
SELECT * FROM products
ORDER BY price ASC
LIMIT 20 OFFSET 0;

-- ## Get All Products versão 2
-- - mocke um intervalo de preços, por exemplo entre 100.00 e 300.00
-- - retorna os produtos com preços dentro do intervalo mockado em ordem crescente
SELECT * FROM products
WHERE price >= 100 AND price <= 300
ORDER BY price ASC;

--## Search Product by name
SELECT * FROM products
WHERE name LIKE '%Cr%';

--## Create Product
INSERT INTO products (id, name, price, description, image_url)
VALUES ('p001', 'mixer', 150, 'Eletrônicos: Mixer 220v, multi funções', 'https://picsum.photos/200'),
("p002", "camiseta", 40, "Roupas e calçados: Camiseta azul com desenho geometricos", 'https://picsum.photos/200'),
("p003", "ipad", 5000, "Eletrônicos: ipad de 6,8 polegadas, bivolt", 'https://picsum.photos/200'),
("p004", "pulseira", 20, "Acessórios: pulseira banhado a ouro com pedrinhas vermelhas", 'https://picsum.photos/200');

--## Get Products by id
SELECT * FROM products
WHERE id = 'p002';

--## Delete Product by id
DELETE FROM products
WHERE id = 'p005';

--## Edit Product by id
UPDATE products
SET 
    name = 'meia', 
    price = 10, 
    description = 'Roupas e calçados',
    image_url = 'https://picsum.photos/200'
WHERE id = 'p004';