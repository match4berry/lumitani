-- 002_seed_data.sql
-- Sample data for Lumitani Dashboard

BEGIN;

-- ============================================================
-- Farmers (Petani)
-- ============================================================
INSERT INTO farmers (name, phone, address) VALUES
  ('Budi Santoso',    '081234567890', 'Desa Sukamaju, Kec. Ciamis, Jawa Barat'),
  ('Siti Aminah',     '082345678901', 'Desa Harapan, Kec. Garut, Jawa Barat'),
  ('Agus Purnomo',    '083456789012', 'Desa Mekar Sari, Kec. Tasikmalaya, Jawa Barat'),
  ('Rina Widiastuti', '084567890123', 'Desa Cikupa, Kec. Subang, Jawa Barat'),
  ('Hendra Wijaya',   '085678901234', 'Desa Tanjung, Kec. Majalengka, Jawa Barat');

-- ============================================================
-- Commodities (Komoditas)
-- ============================================================
INSERT INTO commodities (name, description) VALUES
  ('Beras',   'Beras padi sawah'),
  ('Jagung',  'Jagung pipilan kering'),
  ('Kedelai', 'Kedelai lokal'),
  ('Cabai',   'Cabai merah keriting'),
  ('Bawang Merah', 'Bawang merah lokal');

-- ============================================================
-- Grades
-- ============================================================
-- Beras (commodity_id = 1)
INSERT INTO grades (commodity_id, name, description) VALUES
  (1, 'Premium',  'Butir utuh >95%, kadar air <14%'),
  (1, 'Medium',   'Butir utuh 80-95%'),
  (1, 'Standar',  'Butir utuh <80%');

-- Jagung (commodity_id = 2)
INSERT INTO grades (commodity_id, name, description) VALUES
  (2, 'Grade A', 'Kadar air <15%, bersih'),
  (2, 'Grade B', 'Kadar air 15-17%');

-- Kedelai (commodity_id = 3)
INSERT INTO grades (commodity_id, name, description) VALUES
  (3, 'Grade A', 'Biji utuh >90%'),
  (3, 'Grade B', 'Biji utuh 75-90%');

-- Cabai (commodity_id = 4)
INSERT INTO grades (commodity_id, name, description) VALUES
  (4, 'Super',    'Panjang >12cm, segar'),
  (4, 'Standar',  'Panjang 8-12cm');

-- Bawang Merah (commodity_id = 5)
INSERT INTO grades (commodity_id, name, description) VALUES
  (5, 'Grade A',  'Umbi besar, kering sempurna'),
  (5, 'Grade B',  'Umbi sedang');

-- ============================================================
-- Commodity Prices (Harga — current active period + some history)
-- ============================================================
-- Active prices (current period: 2026-03-01 to 2026-06-30)
INSERT INTO commodity_prices (grade_id, price, start_date, end_date, is_active) VALUES
  -- Beras
  (1,  14500, '2026-03-01', '2026-06-30', TRUE),   -- Beras Premium
  (2,  12000, '2026-03-01', '2026-06-30', TRUE),   -- Beras Medium
  (3,   9500, '2026-03-01', '2026-06-30', TRUE),   -- Beras Standar
  -- Jagung
  (4,   6800, '2026-03-01', '2026-06-30', TRUE),   -- Jagung Grade A
  (5,   5500, '2026-03-01', '2026-06-30', TRUE),   -- Jagung Grade B
  -- Kedelai
  (6,  11000, '2026-03-01', '2026-06-30', TRUE),   -- Kedelai Grade A
  (7,   9000, '2026-03-01', '2026-06-30', TRUE),   -- Kedelai Grade B
  -- Cabai
  (8,  45000, '2026-03-01', '2026-06-30', TRUE),   -- Cabai Super
  (9,  35000, '2026-03-01', '2026-06-30', TRUE),   -- Cabai Standar
  -- Bawang Merah
  (10, 32000, '2026-03-01', '2026-06-30', TRUE),   -- Bawang Merah Grade A
  (11, 26000, '2026-03-01', '2026-06-30', TRUE);   -- Bawang Merah Grade B

-- Historical prices (past period: 2025-09-01 to 2026-02-28)
INSERT INTO commodity_prices (grade_id, price, start_date, end_date, is_active) VALUES
  (1,  13000, '2025-09-01', '2026-02-28', FALSE),  -- Beras Premium (old)
  (2,  11000, '2025-09-01', '2026-02-28', FALSE),  -- Beras Medium (old)
  (4,   6200, '2025-09-01', '2026-02-28', FALSE),  -- Jagung Grade A (old)
  (8,  55000, '2025-09-01', '2026-02-28', FALSE),  -- Cabai Super (old, musim hujan)
  (10, 28000, '2025-09-01', '2026-02-28', FALSE);  -- Bawang Merah Grade A (old)

-- ============================================================
-- Products (Produk)
-- ============================================================
INSERT INTO products (farmer_id, commodity_id, grade_id, name, description, stock, photo_url, is_active) VALUES
  -- Budi Santoso — Beras
  (1, 1, 1, 'Beras Premium Ciamis',     'Beras premium dari sawah organik Ciamis',            120, 'https://placehold.co/400x400?text=Beras+Premium',   TRUE),
  (1, 1, 2, 'Beras Medium Ciamis',      'Beras medium kualitas baik',                          80, 'https://placehold.co/400x400?text=Beras+Medium',    TRUE),

  -- Siti Aminah — Cabai
  (2, 4, 8, 'Cabai Merah Super Garut',   'Cabai merah keriting super segar dari Garut',         45, 'https://placehold.co/400x400?text=Cabai+Super',     TRUE),
  (2, 4, 9, 'Cabai Merah Standar Garut', 'Cabai merah keriting standar',                        60, 'https://placehold.co/400x400?text=Cabai+Standar',   TRUE),

  -- Agus Purnomo — Jagung
  (3, 2, 4, 'Jagung Pipilan Tasik A',    'Jagung pipilan kering grade A dari Tasikmalaya',     200, 'https://placehold.co/400x400?text=Jagung+A',        TRUE),
  (3, 2, 5, 'Jagung Pipilan Tasik B',    'Jagung pipilan kering grade B',                      150, NULL,                                                 FALSE),

  -- Rina Widiastuti — Bawang Merah
  (4, 5, 10, 'Bawang Merah Subang A',    'Bawang merah lokal grade A dari Subang',              90, 'https://placehold.co/400x400?text=Bawang+A',        TRUE),
  (4, 5, 11, 'Bawang Merah Subang B',    'Bawang merah lokal grade B',                          70, 'https://placehold.co/400x400?text=Bawang+B',        TRUE),

  -- Hendra Wijaya — Kedelai
  (5, 3, 6, 'Kedelai Lokal Majalengka',  'Kedelai lokal grade A dari Majalengka',               55, 'https://placehold.co/400x400?text=Kedelai+A',       TRUE),

  -- Extra: product without active price (inactive, for demo)
  (5, 3, 7, 'Kedelai Grade B Majalengka','Kedelai lokal grade B — belum dipublish',              30, NULL,                                                 FALSE);

COMMIT;
