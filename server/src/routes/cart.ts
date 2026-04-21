import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET cart items for a specific user
router.get("/user/:user_id", async (req: Request, res: Response) => {
  const user_id = req.params.user_id as string;

  try {
    const { rows } = await pool.query(
      `SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        p.name as product_name,
        p.price,
        p.photo_url,
        ci.added_at,
        ci.updated_at
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      ORDER BY ci.added_at DESC`,
      [user_id]
    );

    const total = rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = rows.length;

    res.json({
      success: true,
      user_id: parseInt(user_id),
      items: rows,
      itemCount,
      total
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// GET single cart item
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const { rows } = await pool.query(
      `SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        p.name as product_name,
        p.price,
        p.photo_url,
        ci.added_at,
        ci.updated_at
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = $1`,
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    res.json({
      success: true,
      item: rows[0]
    });
  } catch (err) {
    console.error("Error fetching cart item:", err);
    res.status(500).json({ error: "Failed to fetch cart item" });
  }
});

// POST add item to cart
router.post("/", async (req: Request, res: Response) => {
  const { user_id, product_id, quantity = 1 } = req.body;

  // Validation
  if (!user_id || !product_id) {
    res.status(400).json({ error: "user_id and product_id are required" });
    return;
  }

  if (quantity < 1) {
    res.status(400).json({ error: "quantity must be at least 1" });
    return;
  }

  try {
    // Check if product exists
    const productCheck = await pool.query(
      "SELECT id FROM products WHERE id = $1",
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Check if user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if item already in cart
    const cartCheck = await pool.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (cartCheck.rows.length > 0) {
      // Update quantity if already exists
      const newQuantity = cartCheck.rows[0].quantity + quantity;
      const { rows } = await pool.query(
        `UPDATE cart_items 
         SET quantity = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, user_id, product_id, quantity, added_at, updated_at`,
        [newQuantity, cartCheck.rows[0].id]
      );

      res.status(200).json({
        success: true,
        message: "Item quantity updated in cart",
        cart_item: rows[0]
      });
      return;
    }

    // Insert new cart item
    const { rows } = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, product_id, quantity, added_at, updated_at`,
      [user_id, product_id, quantity]
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      cart_item: rows[0]
    });
  } catch (err: any) {
    console.error("Error adding to cart:", err);
    if (err.code === "23505") {
      res.status(409).json({ error: "Item already in cart" });
      return;
    }
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// PUT update cart item quantity
router.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { quantity } = req.body;

  // Validation
  if (!quantity || quantity < 1) {
    res.status(400).json({ error: "quantity must be at least 1" });
    return;
  }

  try {
    // Check if cart item exists
    const cartCheck = await pool.query(
      "SELECT id FROM cart_items WHERE id = $1",
      [id]
    );

    if (cartCheck.rows.length === 0) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    const { rows } = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING 
        id,
        user_id,
        product_id,
        quantity,
        added_at,
        updated_at`,
      [quantity, id]
    );

    res.json({
      success: true,
      message: "Item quantity updated",
      cart_item: rows[0]
    });
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE remove item from cart
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    // Check if cart item exists
    const cartCheck = await pool.query(
      "SELECT id FROM cart_items WHERE id = $1",
      [id]
    );

    if (cartCheck.rows.length === 0) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }

    await pool.query("DELETE FROM cart_items WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Item removed from cart"
    });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

// DELETE clear entire cart for user
router.delete("/user/:user_id", async (req: Request, res: Response) => {
  const user_id = req.params.user_id as string;

  try {
    // Check if user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { rowCount } = await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1",
      [user_id]
    );

    res.json({
      success: true,
      message: `Cart cleared. ${rowCount} items removed`,
      items_removed: rowCount
    });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
