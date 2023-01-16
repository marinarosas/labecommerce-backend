-- Active: 1673889528617@@127.0.0.1@3306

-- ## a) Criação da tabela de **pessoas usuárias**
-- - nome da tabela: **users**
-- - colunas da tabela:
--   - id (TEXT, PK, único e obrigatório)
--   - email (TEXT, único e obrigatório)
--   - password (TEXT e obrigatório)

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

SELECT * FROM users;

DROP TABLE users;

INSERT INTO users (id, email, password)
VALUES
("u01", "marina@email.com", "123456789"),
("u02", "alex@email.com", "1011121314"),
("u03", "andrea@email.com", "1562756528");


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
    category TEXT NOT NULL
);

SELECT * FROM products;

DROP TABLE products;

INSERT INTO products (id, name, price, category)
VALUES
("p01", "Camiseta", 39.90, "Roupas e calçados"),
("p02", "Ipad", 3999.90, "Eletrônicos"),
("p03", "Pulseira", 19.90, "Acessórios")

