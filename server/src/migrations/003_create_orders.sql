-- 003_create_orders.sql
-- Tables: orders, order_items

BEGIN;

-- ============================================================
-- 1. Orders (Pesanan)
-- ============================================================
CREATE TABLE orders (
    id            SERIAL PRIMARY KEY,
    order_code    VARCHAR(20) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'menunggu_proses'
                  CHECK (status IN ('menunggu_proses', 'diproses', 'dikirim', 'selesai')),
    total_price   NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
    order_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_order_date ON orders (order_date);

-- ============================================================
-- 2. Order Items (Item Pesanan)
-- ============================================================
CREATE TABLE order_items (
    id            SERIAL PRIMARY KEY,
    order_id      INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id    INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity      INT NOT NULL CHECK (quantity > 0),
    unit_price    NUMERIC(15,2) NOT NULL CHECK (unit_price >= 0),
    subtotal      NUMERIC(15,2) NOT NULL CHECK (subtotal >= 0),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- ============================================================
-- Auto-update triggers
-- ============================================================
CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMIT;
