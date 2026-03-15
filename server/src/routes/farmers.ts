import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET all farmers
router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT * FROM farmers ORDER BY created_at DESC"
  );
  res.json(rows);
});

// GET single farmer
router.get("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query("SELECT * FROM farmers WHERE id = $1", [
    req.params.id,
  ]);
  if (rows.length === 0) {
    res.status(404).json({ error: "Farmer not found" });
    return;
  }
  res.json(rows[0]);
});

// POST create farmer
router.post("/", async (req: Request, res: Response) => {
  const { name, phone, address } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO farmers (name, phone, address) VALUES ($1, $2, $3) RETURNING *",
    [name, phone, address]
  );
  res.status(201).json(rows[0]);
});

// PUT update farmer
router.put("/:id", async (req: Request, res: Response) => {
  const { name, phone, address, is_active } = req.body;
  const { rows } = await pool.query(
    `UPDATE farmers SET name = $1, phone = $2, address = $3, is_active = $4
     WHERE id = $5 RETURNING *`,
    [name, phone, address, is_active, req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "Farmer not found" });
    return;
  }
  res.json(rows[0]);
});

// DELETE farmer
router.delete("/:id", async (req: Request, res: Response) => {
  const { rowCount } = await pool.query("DELETE FROM farmers WHERE id = $1", [
    req.params.id,
  ]);
  if (rowCount === 0) {
    res.status(404).json({ error: "Farmer not found" });
    return;
  }
  res.json({ message: "Farmer deleted" });
});

export default router;
