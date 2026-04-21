-- 010_create_addresses.sql
-- Table: addresses (shipping addresses for users)

BEGIN;

CREATE TABLE addresses (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label         VARCHAR(100),
    name          VARCHAR(255) NOT NULL,
    phone         VARCHAR(20) NOT NULL,
    address       TEXT NOT NULL,
    city          VARCHAR(100),
    postal_code   VARCHAR(10),
    is_primary    BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses (user_id);
CREATE INDEX idx_addresses_is_primary ON addresses (user_id, is_primary);

CREATE TRIGGER trg_addresses_updated_at
    BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Ensure only one primary address per user
CREATE UNIQUE INDEX idx_addresses_primary_per_user 
    ON addresses (user_id) 
    WHERE is_primary = true;

COMMIT;
