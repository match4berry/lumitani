BEGIN;

INSERT INTO orders (customer_name, total_price, status, created_at) VALUES
('Budi', 150000, 'Selesai', '2026-01-10'),
('Siti', 200000, 'Selesai', '2026-02-15'),
('Andi', 175000, 'Selesai', '2026-03-20'),
('Rina', 220000, 'Selesai', '2026-03-25'),
('Agus', 125000, 'Pending', '2026-03-28'),
('Dewi', 300000, 'Selesai', '2025-12-05');

COMMIT;