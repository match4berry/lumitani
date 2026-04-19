-- 008_add_product_features.sql
-- Add keunggulan_produk (product advantages list) and panen_terakhir (last harvest date)

BEGIN;

ALTER TABLE products
  ADD COLUMN keunggulan_produk TEXT[] DEFAULT '{}',
  ADD COLUMN panen_terakhir DATE;

COMMIT;
