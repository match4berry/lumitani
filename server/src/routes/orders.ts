import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET all orders
router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT * FROM orders ORDER BY order_date DESC
  `);
  res.json(rows);
});

// GET order status summary counts
router.get("/summary", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT status, COUNT(*)::int AS count
    FROM orders
    GROUP BY status
  `);
  const summary: Record<string, number> = {
    menunggu_proses: 0,
    diproses: 0,
    dikirim: 0,
    selesai: 0,
  };
  for (const row of rows) {
    summary[row.status] = row.count;
  }
  res.json(summary);
});

// GET single order with items
router.get("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [
    req.params.id,
  ]);
  if (rows.length === 0) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const { rows: items } = await pool.query(
    `SELECT oi.*, p.name AS product_name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
    [req.params.id]
  );

  res.json({ ...rows[0], items });
});

// PATCH update order status
router.patch("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ["menunggu_proses", "diproses", "dikirim", "selesai"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const { rows } = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(rows[0]);
});

export default router;
