-- 009_add_password_to_users.sql
-- Add password column to users table for authentication

BEGIN;

ALTER TABLE users ADD COLUMN password VARCHAR(255);
ALTER TABLE users ADD COLUMN last_login TIMESTAMPTZ;

COMMIT;
