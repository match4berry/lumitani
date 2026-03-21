import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET prices (optionally filter by grade_id, includes history)
router.get("/", async (req: Request, res: Response) => {
  const { grade_id } = req.query;
  let query = `
    SELECT cp.*, g.name AS grade_name, c.name AS commodity_name
    FROM commodity_prices cp
    JOIN grades g ON g.id = cp.grade_id
    JOIN commodities c ON c.id = g.commodity_id
  `;
  const params: unknown[] = [];
  if (grade_id) {
    query += " WHERE cp.grade_id = $1";
    params.push(grade_id);
  }
  query += " ORDER BY cp.start_date DESC";
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

// GET active price for a grade (for product price lookup)
router.get("/active/:gradeId", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT cp.*, g.name AS grade_name, c.name AS commodity_name
     FROM commodity_prices cp
     JOIN grades g ON g.id = cp.grade_id
     JOIN commodities c ON c.id = g.commodity_id
     WHERE cp.grade_id = $1
       AND cp.is_active = TRUE
       AND CURRENT_DATE BETWEEN cp.start_date AND cp.end_date
     LIMIT 1`,
    [req.params.gradeId]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "No active price for this grade" });
    return;
  }
  res.json(rows[0]);
});

// POST create price
router.post("/", async (req: Request, res: Response) => {
  const { grade_id, price, start_date, end_date } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO commodity_prices (grade_id, price, start_date, end_date)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [grade_id, price, start_date, end_date]
  );
  res.status(201).json(rows[0]);
});

// PUT update price
router.put("/:id", async (req: Request, res: Response) => {
  const { price, start_date, end_date, is_active } = req.body;
  const { rows } = await pool.query(
    `UPDATE commodity_prices
     SET price = $1, start_date = $2, end_date = $3, is_active = $4
     WHERE id = $5 RETURNING *`,
    [price, start_date, end_date, is_active, req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "Price not found" });
    return;
  }
  res.json(rows[0]);
});

// DELETE price
router.delete("/:id", async (req: Request, res: Response) => {
  const { rowCount } = await pool.query(
    "DELETE FROM commodity_prices WHERE id = $1",
    [req.params.id]
  );
  if (rowCount === 0) {
    res.status(404).json({ error: "Price not found" });
    return;
  }
  res.json({ message: "Price deleted" });
});

export default router;
