import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET all users
router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, phone, address, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC"
  );
  res.json(rows);
});

// GET single user
router.get("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, phone, address, role, is_active, created_at, updated_at FROM users WHERE id = $1",
    [req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(rows[0]);
});

// POST create user
router.post("/", async (req: Request, res: Response) => {
  const { name, email, phone, address, role } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, phone, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, address, role, is_active, created_at, updated_at`,
      [name, email, phone || null, address || null, role || "user"]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    throw err;
  }
});

// PUT update user
router.put("/:id", async (req: Request, res: Response) => {
  const { name, email, phone, address, role, is_active } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users SET name = $1, email = $2, phone = $3, address = $4, role = $5, is_active = $6
       WHERE id = $7
       RETURNING id, name, email, phone, address, role, is_active, created_at, updated_at`,
      [name, email, phone || null, address || null, role || "user", is_active ?? true, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    throw err;
  }
});

// DELETE user
router.delete("/:id", async (req: Request, res: Response) => {
  const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
    req.params.id,
  ]);
  if (rowCount === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ message: "User deleted" });
});

export default router;
