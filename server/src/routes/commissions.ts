import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET current commission rate
router.get("/settings", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT * FROM commission_settings ORDER BY id DESC LIMIT 1"
  );
  if (rows.length === 0) {
    res.json({ id: null, rate: 5.0 });
    return;
  }
  res.json(rows[0]);
});

// PUT update commission rate (only affects new transactions)
router.put("/settings", async (req: Request, res: Response) => {
  const { rate } = req.body;
  if (rate == null || rate < 0 || rate > 100) {
    res.status(400).json({ error: "rate harus antara 0 dan 100" });
    return;
  }

  const { rows: existing } = await pool.query(
    "SELECT id FROM commission_settings ORDER BY id DESC LIMIT 1"
  );

  if (existing.length === 0) {
    const { rows } = await pool.query(
      "INSERT INTO commission_settings (rate) VALUES ($1) RETURNING *",
      [rate]
    );
    res.json(rows[0]);
  } else {
    const { rows } = await pool.query(
      "UPDATE commission_settings SET rate = $1 WHERE id = $2 RETURNING *",
      [rate, existing[0].id]
    );
    res.json(rows[0]);
  }
});

// GET commission report (aggregate data for completed orders)
router.get("/report", async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;

  let dateFilter = "";
  const params: any[] = [];

  if (start_date && end_date) {
    dateFilter = " AND o.order_date BETWEEN $1 AND $2";
    params.push(start_date, end_date);
  } else if (start_date) {
    dateFilter = " AND o.order_date >= $1";
    params.push(start_date);
  } else if (end_date) {
    dateFilter = " AND o.order_date <= $1";
    params.push(end_date);
  }

  // Summary totals
  const { rows: summaryRows } = await pool.query(
    `SELECT
       COUNT(*)::int AS total_orders,
       COALESCE(SUM(total_price), 0) AS total_revenue,
       COALESCE(SUM(commission_amount), 0) AS total_commission
     FROM orders o
     WHERE o.status = 'selesai'
       AND o.commission_amount IS NOT NULL${dateFilter}`,
    params
  );

  // Per-order breakdown
  const { rows: orders } = await pool.query(
    `SELECT o.id, o.order_code, o.customer_name, o.order_date, o.total_price,
            o.commission_rate, o.commission_amount, o.status
     FROM orders o
     WHERE o.status = 'selesai'
       AND o.commission_amount IS NOT NULL${dateFilter}
     ORDER BY o.order_date DESC`,
    params
  );

  res.json({
    summary: summaryRows[0],
    orders,
  });
});

export default router;
