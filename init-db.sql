-- Используется psql-метакоманда \gexec, поэтому файл нужно выполнять через psql.
SELECT 'CREATE DATABASE dashboard_db'
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = 'dashboard_db'
)\gexec

\c dashboard_db

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS clients;

-- =================================================---------------
-- Таблица clients
-- =================================================---------------
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    birth_date DATE,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    discount NUMERIC(5, 2) NOT NULL DEFAULT 0,

    CONSTRAINT clients_discount_check
        CHECK (discount >= 0 AND discount <= 100)
);

-- =================================================---------------
-- Таблица orders
-- =================================================---------------
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,

    CONSTRAINT orders_client_id_fkey
        FOREIGN KEY (client_id)
        REFERENCES clients (id)
        ON DELETE CASCADE,

    CONSTRAINT orders_quantity_check
        CHECK (quantity > 0),

    CONSTRAINT orders_amount_check
        CHECK (amount >= 0)
);

CREATE INDEX idx_orders_client_id
    ON orders (client_id);

-- =================================================---------------
-- Заполнение таблицы clients
-- =================================================---------------
INSERT INTO clients (
    full_name,
    city,
    birth_date,
    loyalty_points,
    discount
)
SELECT
    'Клиент ' || gs.i,
    CASE gs.i % 5
        WHEN 0 THEN 'Москва'
        WHEN 1 THEN 'Санкт-Петербург'
        WHEN 2 THEN 'Казань'
        WHEN 3 THEN 'Новосибирск'
        ELSE 'Екатеринбург'
    END,
    DATE '1970-01-01' + (gs.i % 15000),
    (gs.i * 13) % 1000,
    ROUND(((gs.i % 25) * 0.5)::NUMERIC, 2)
FROM generate_series(1, 150) AS gs(i);

-- =================================================---------------
-- Заполнение таблицы orders
-- =================================================---------------
WITH client_stats AS (
    SELECT
        MIN(id) AS min_id,
        COUNT(*)::INT AS cnt
    FROM clients
)
INSERT INTO orders (
    client_id,
    title,
    order_date,
    quantity,
    amount
)
SELECT
    cs.min_id + (gs.i % cs.cnt),
    'Заказ #' || gs.i,
    DATE '2024-01-01' + (gs.i % 365),
    1 + (gs.i % 9),
    ROUND(((100 + (gs.i % 900)) * (1 + (gs.i % 9)))::NUMERIC, 2)
FROM generate_series(1, 300) AS gs(i)
CROSS JOIN client_stats cs
WHERE cs.cnt > 0;
