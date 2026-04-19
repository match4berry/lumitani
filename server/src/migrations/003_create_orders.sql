BEGIN;

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name TEXT,
    total_price NUMERIC(15,2),
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;