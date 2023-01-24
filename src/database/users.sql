-- Active: 1674516160340@@127.0.0.1@3306

-- ## a) Criação da tabela de **pessoas usuárias**
-- - nome da tabela: **users**
-- - colunas da tabela:
--   - id (TEXT, PK, único e obrigatório)
--   - email (TEXT, único e obrigatório)
--   - password (TEXT e obrigatório)
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL
);

DROP TABLE users;

-- ## Get All Users
SELECT * FROM users;

--- retorna o resultado ordenado pela coluna email em ordem crescente
SELECT * FROM users
ORDER BY email ASC;

-- ## Create User
INSERT INTO users (id, name, email, password)
VALUES
('u001', 'Marina', 'marina@email.com', 'marina123'),
('u002', 'Alex', 'alex@email.com', 'alex123'),
('u003', 'Andrea', 'andrea@email.com', 'andrea123');

--## Delete User by id
DELETE FROM users
WHERE id = 'u002';

--## Edit User by id
UPDATE users
SET password = "and123rea"
WHERE id = "u003";