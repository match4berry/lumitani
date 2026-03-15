import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET grades (optionally filter by commodity_id)
router.get("/", async (req: Request, res: Response) => {
  const { commodity_id } = req.query;
  let query = `
    SELECT g.*, c.name AS commodity_name
    FROM grades g
    JOIN commodities c ON c.id = g.commodity_id
  `;
  const params: unknown[] = [];
  if (commodity_id) {
    query += " WHERE g.commodity_id = $1";
    params.push(commodity_id);
  }
  query += " ORDER BY c.name, g.name";
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

// POST create grade
router.post("/", async (req: Request, res: Response) => {
  const { commodity_id, name, description } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO grades (commodity_id, name, description) VALUES ($1, $2, $3) RETURNING *",
    [commodity_id, name, description]
  );
  res.status(201).json(rows[0]);
});

// PUT update grade
router.put("/:id", async (req: Request, res: Response) => {
  const { commodity_id, name, description } = req.body;
  const { rows } = await pool.query(
    "UPDATE grades SET commodity_id = $1, name = $2, description = $3 WHERE id = $4 RETURNING *",
    [commodity_id, name, description, req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "Grade not found" });
    return;
  }
  res.json(rows[0]);
});

// DELETE grade
router.delete("/:id", async (req: Request, res: Response) => {
  const { rowCount } = await pool.query("DELETE FROM grades WHERE id = $1", [
    req.params.id,
  ]);
  if (rowCount === 0) {
    res.status(404).json({ error: "Grade not found" });
    return;
  }
  res.json({ message: "Grade deleted" });
});

export default router;
