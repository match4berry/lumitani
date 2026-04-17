-- 006_add_user_id_to_orders.sql
-- Add user_id foreign key to orders table

BEGIN;

ALTER TABLE orders
    ADD COLUMN user_id INT REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_orders_user_id ON orders (user_id);

COMMIT;
