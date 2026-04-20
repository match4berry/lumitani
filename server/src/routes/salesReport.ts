import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET /api/sales-report
// Returns sales data grouped by farmer from completed orders only
// Optional query params: start_date, end_date
router.get("/", async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;

  let dateFilter = "";
  const params: any[] = [];
  if (start_date) {
    params.push(start_date);
    dateFilter += ` AND o.order_date >= $${params.length}`;
  }
  if (end_date) {
    params.push(end_date);
    dateFilter += ` AND o.order_date <= $${params.length}`;
  }

  // Summary: totals across all completed orders in range
  const summaryQuery = pool.query(
    `SELECT
       COALESCE(SUM(o.total_price), 0)::numeric AS total_revenue,
       COUNT(DISTINCT o.id)::int AS total_transactions,
       COUNT(DISTINCT p.farmer_id)::int AS total_farmers
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON p.id = oi.product_id
     WHERE o.status = 'selesai'${dateFilter}`,
    params
  );

  // Per-farmer breakdown
  const farmerQuery = pool.query(
    `SELECT
       f.id AS farmer_id,
       f.name AS farmer_name,
       SUM(oi.subtotal)::numeric AS total_sales,
       COUNT(DISTINCT o.id)::int AS total_transactions,
       ROUND(SUM(oi.subtotal) / NULLIF(COUNT(DISTINCT o.id), 0), 2)::numeric AS avg_order_value
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON p.id = oi.product_id
     JOIN farmers f ON f.id = p.farmer_id
     WHERE o.status = 'selesai'${dateFilter}
     GROUP BY f.id, f.name
     ORDER BY total_sales DESC`,
    params
  );

  const [summaryResult, farmerResult] = await Promise.all([summaryQuery, farmerQuery]);

  res.json({
    summary: summaryResult.rows[0],
    farmers: farmerResult.rows,
  });
});

export default router;
