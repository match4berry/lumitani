import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET all orders (optional filter: ?user_id=X)
router.get("/", async (req: Request, res: Response) => {
  const { user_id } = req.query;
  let query = `
    SELECT o.*, u.name AS user_name
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
  `;
  const params: any[] = [];
  if (user_id) {
    query += " WHERE o.user_id = $1";
    params.push(user_id);
  }
  query += " ORDER BY o.order_date DESC";
  const { rows } = await pool.query(query, params);
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

// POST create a new order
router.post("/", async (req: Request, res: Response) => {
  const { customer_name, items, user_id } = req.body;

  // --- 1. Validate the request body ---
  if (!customer_name || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "customer_name and items[] are required" });
    return;
  }

  const client = await pool.connect(); // grab a client for transaction
  try {
    await client.query("BEGIN");

    // --- 2. Generate a unique order code (e.g. ORD-20260402-00042) ---
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const { rows: seqRows } = await client.query(
      "SELECT COUNT(*)::int + 1 AS seq FROM orders WHERE order_date = CURRENT_DATE"
    );
    const seq = String(seqRows[0].seq).padStart(5, "0");
    const order_code = `ORD-${today}-${seq}`;

    // --- 3. Look up product prices and calculate totals ---
    let total_price = 0;
    const orderItems: { product_id: number; quantity: number; unit_price: number; subtotal: number }[] = [];

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        throw new Error("Each item needs a valid product_id and quantity > 0");
      }
      // Look up the product, its stock, and its current active price via grade_id
      const { rows: productRows } = await client.query(
        `SELECT p.id, p.name, p.stock, cp.price
         FROM products p
         JOIN commodity_prices cp ON cp.grade_id = p.grade_id
           AND cp.is_active = true
           AND CURRENT_DATE BETWEEN cp.start_date AND cp.end_date
         WHERE p.id = $1
         LIMIT 1`,
        [item.product_id]
      );
      if (productRows.length === 0) {
        throw new Error(`Product ${item.product_id} not found or has no active price`);
      }
      const product = productRows[0];
      if (product.stock < item.quantity) {
        throw new Error(
          `Stok tidak cukup untuk "${product.name}": tersedia ${product.stock}, diminta ${item.quantity}`
        );
      }
      const unit_price = Number(product.price);
      const subtotal = unit_price * item.quantity;
      total_price += subtotal;
      orderItems.push({ product_id: item.product_id, quantity: item.quantity, unit_price, subtotal });
    }

    // --- 4. Fetch current commission rate & calculate commission upfront ---
    const { rows: commRows } = await client.query(
      "SELECT rate FROM commission_settings ORDER BY id DESC LIMIT 1"
    );
    const commission_rate = commRows.length > 0 ? Number(commRows[0].rate) : 5.0;
    const commission_amount = Math.round(total_price * commission_rate / 100 * 100) / 100;

    // --- 5. Insert the order row ---
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (order_code, customer_name, total_price, user_id, commission_rate, commission_amount)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [order_code, customer_name, total_price, user_id || null, commission_rate, commission_amount]
    );
    const order = orderRows[0];

    // --- 6. Insert each order item & reduce stock ---
    for (const oi of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, oi.product_id, oi.quantity, oi.unit_price, oi.subtotal]
      );
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [oi.quantity, oi.product_id]
      );
    }

    await client.query("COMMIT");

    // --- 7. Return the created order with its items ---
    res.status(201).json({ ...order, items: orderItems });
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PATCH update order status (must follow sequential order)
const STATUS_FLOW = ["menunggu_proses", "diproses", "dikirim", "selesai"];

router.patch("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  if (!STATUS_FLOW.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  // Fetch current order
  const { rows: current } = await pool.query(
    "SELECT * FROM orders WHERE id = $1",
    [req.params.id]
  );
  if (current.length === 0) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const currentIndex = STATUS_FLOW.indexOf(current[0].status);
  const newIndex = STATUS_FLOW.indexOf(status);

  if (newIndex !== currentIndex + 1) {
    const nextStatus = STATUS_FLOW[currentIndex + 1] || "(sudah selesai)";
    res.status(400).json({
      error: `Status hanya bisa diubah ke tahap berikutnya: ${nextStatus}`,
    });
    return;
  }

  const { rows } = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, req.params.id]
  );

  res.json(rows[0]);
});

export default router;
