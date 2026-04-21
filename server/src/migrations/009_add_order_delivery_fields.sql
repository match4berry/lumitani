-- 009_add_order_delivery_fields.sql
-- Add delivery and payment fields to orders table

BEGIN;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS pengiriman       VARCHAR(100),
  ADD COLUMN IF NOT EXISTS no_hp            VARCHAR(20),
  ADD COLUMN IF NOT EXISTS metode_pembayaran VARCHAR(50);

COMMIT;
