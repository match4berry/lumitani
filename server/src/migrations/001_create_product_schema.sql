-- 001_create_product_schema.sql
-- Tables: farmers, commodities, grades, commodity_prices, products

BEGIN;

-- Enable btree_gist for exclusion constraint on overlapping price periods
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- 1. Farmers (Petani)
-- ============================================================
CREATE TABLE farmers (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    address       TEXT,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. Commodities (Komoditas)
-- ============================================================
CREATE TABLE commodities (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL UNIQUE,
    description   TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. Grades (Grade per Komoditas)
-- ============================================================
CREATE TABLE grades (
    id            SERIAL PRIMARY KEY,
    commodity_id  INT NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
    name          VARCHAR(100) NOT NULL,       -- e.g. "Grade A", "Premium"
    description   TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (commodity_id, name)
);

CREATE INDEX idx_grades_commodity_id ON grades (commodity_id);

-- ============================================================
-- 4. Commodity Prices (Harga Kolektif per Grade + Periode)
--    - Harga per grade with start/end validity
--    - Only one active price per grade in any time range
--    - Rows are never deleted → full price history
-- ============================================================
CREATE TABLE commodity_prices (
    id            SERIAL PRIMARY KEY,
    grade_id      INT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    price         NUMERIC(15,2) NOT NULL CHECK (price >= 0),
    start_date    DATE NOT NULL,
    end_date      DATE NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_date_range CHECK (end_date >= start_date),

    -- Prevent overlapping active price periods for the same grade
    CONSTRAINT excl_active_price_overlap
        EXCLUDE USING gist (
            grade_id WITH =,
            daterange(start_date, end_date, '[]') WITH &&
        ) WHERE (is_active = TRUE)
);

CREATE INDEX idx_commodity_prices_grade_id ON commodity_prices (grade_id);
CREATE INDEX idx_commodity_prices_active   ON commodity_prices (grade_id, is_active)
    WHERE is_active = TRUE;

-- ============================================================
-- 5. Products (Produk)
--    - Admin picks farmer, commodity, grade
--    - Price auto-follows active collective price
--    - Stock, photo, active/inactive
--    - Inactive → hidden from marketplace
-- ============================================================
CREATE TABLE products (
    id               SERIAL PRIMARY KEY,
    farmer_id        INT NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
    commodity_id     INT NOT NULL REFERENCES commodities(id) ON DELETE RESTRICT,
    grade_id         INT NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    stock            INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    photo_url        TEXT,                    -- URL / path of uploaded photo
    is_active        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_farmer_id    ON products (farmer_id);
CREATE INDEX idx_products_commodity_id ON products (commodity_id);
CREATE INDEX idx_products_grade_id     ON products (grade_id);
CREATE INDEX idx_products_active       ON products (is_active) WHERE is_active = TRUE;

-- ============================================================
-- Helper: auto-update updated_at on row changes
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_farmers_updated_at
    BEFORE UPDATE ON farmers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_commodities_updated_at
    BEFORE UPDATE ON commodities FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_grades_updated_at
    BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_commodity_prices_updated_at
    BEFORE UPDATE ON commodity_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMIT;
