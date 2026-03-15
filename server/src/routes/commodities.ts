import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET all commodities
router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT * FROM commodities ORDER BY name ASC"
  );
  res.json(rows);
});

// POST create commodity
router.post("/", async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO commodities (name, description) VALUES ($1, $2) RETURNING *",
    [name, description]
  );
  res.status(201).json(rows[0]);
});

// PUT update commodity
router.put("/:id", async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const { rows } = await pool.query(
    "UPDATE commodities SET name = $1, description = $2 WHERE id = $3 RETURNING *",
    [name, description, req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "Commodity not found" });
    return;
  }
  res.json(rows[0]);
});

// DELETE commodity
router.delete("/:id", async (req: Request, res: Response) => {
  const { rowCount } = await pool.query(
    "DELETE FROM commodities WHERE id = $1",
    [req.params.id]
  );
  if (rowCount === 0) {
    res.status(404).json({ error: "Commodity not found" });
    return;
  }
  res.json({ message: "Commodity deleted" });
});

export default router;
