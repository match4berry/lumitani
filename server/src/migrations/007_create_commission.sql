-- 007_create_commission.sql
-- Commission settings table + commission fields on orders

BEGIN;

-- ============================================================
-- 1. Commission Settings (Pengaturan Komisi)
-- ============================================================
CREATE TABLE commission_settings (
    id              SERIAL PRIMARY KEY,
    rate            NUMERIC(5,2) NOT NULL DEFAULT 5.00 CHECK (rate >= 0 AND rate <= 100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_commission_settings_updated_at
    BEFORE UPDATE ON commission_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed default 5% commission rate
INSERT INTO commission_settings (rate) VALUES (5.00);

-- ============================================================
-- 2. Add commission snapshot columns to orders
-- ============================================================
ALTER TABLE orders
    ADD COLUMN commission_rate   NUMERIC(5,2) DEFAULT NULL,
    ADD COLUMN commission_amount NUMERIC(15,2) DEFAULT NULL;

-- Backfill existing "selesai" orders with the default 5% rate
UPDATE orders
SET commission_rate = 5.00,
    commission_amount = ROUND(total_price * 5.00 / 100, 2)
WHERE status = 'selesai';

COMMIT;
