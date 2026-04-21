import { Router, Request, Response } from "express";
import pool from "../config/db";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();

// ===== ADDRESS ROUTES (All require authentication) =====

// GET all addresses for logged-in user
router.get("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    console.log("[ADDRESS GET] Fetching addresses for user:", userId);

    const { rows } = await pool.query(
      `SELECT id, user_id, label, name, phone, address, city, postal_code, is_primary, created_at, updated_at
       FROM addresses 
       WHERE user_id = $1 
       ORDER BY is_primary DESC, created_at DESC`,
      [userId]
    );

    console.log("[ADDRESS GET] Found", rows.length, "addresses");
    res.json({
      success: true,
      addresses: rows,
      total: rows.length
    });
  } catch (err) {
    console.error("[ADDRESS GET] Error:", err);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// GET single address by ID
router.get("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    console.log("[ADDRESS GET ONE] Fetching address:", id, "for user:", userId);

    const { rows } = await pool.query(
      `SELECT id, user_id, label, name, phone, address, city, postal_code, is_primary, created_at, updated_at
       FROM addresses 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (rows.length === 0) {
      console.log("[ADDRESS GET ONE] Address not found or unauthorized");
      res.status(404).json({ error: "Address not found" });
      return;
    }

    console.log("[ADDRESS GET ONE] Address found");
    res.json({
      success: true,
      address: rows[0]
    });
  } catch (err) {
    console.error("[ADDRESS GET ONE] Error:", err);
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

// POST create new address
router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { label, name, phone, address, city, postal_code, is_primary } = req.body;
    const userId = req.userId;

    console.log("[ADDRESS CREATE] Creating address for user:", userId);

    // Validation
    if (!name || !phone || !address) {
      console.log("[ADDRESS CREATE] Validation failed: missing required fields");
      res.status(400).json({ error: "name, phone, and address are required" });
      return;
    }

    // If this is being set as primary, unset other primary addresses
    if (is_primary) {
      await pool.query(
        "UPDATE addresses SET is_primary = false WHERE user_id = $1",
        [userId]
      );
      console.log("[ADDRESS CREATE] Unset other primary addresses");
    }

    // Create address
    const { rows } = await pool.query(
      `INSERT INTO addresses (user_id, label, name, phone, address, city, postal_code, is_primary)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, user_id, label, name, phone, address, city, postal_code, is_primary, created_at, updated_at`,
      [userId, label || null, name, phone, address, city || null, postal_code || null, is_primary || false]
    );

    console.log("[ADDRESS CREATE] Address created with id:", rows[0].id);
    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address: rows[0]
    });
  } catch (err) {
    console.error("[ADDRESS CREATE] Error:", err);
    res.status(500).json({ error: "Failed to create address" });
  }
});

// PUT update address
router.put("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { label, name, phone, address, city, postal_code, is_primary } = req.body;

    console.log("[ADDRESS UPDATE] Updating address:", id, "for user:", userId);

    // Validation
    if (!name || !phone || !address) {
      console.log("[ADDRESS UPDATE] Validation failed: missing required fields");
      res.status(400).json({ error: "name, phone, and address are required" });
      return;
    }

    // Check if address belongs to user
    const checkResult = await pool.query(
      "SELECT id FROM addresses WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      console.log("[ADDRESS UPDATE] Address not found or unauthorized");
      res.status(404).json({ error: "Address not found" });
      return;
    }

    // If this is being set as primary, unset other primary addresses
    if (is_primary) {
      await pool.query(
        "UPDATE addresses SET is_primary = false WHERE user_id = $1 AND id != $2",
        [userId, id]
      );
      console.log("[ADDRESS UPDATE] Unset other primary addresses");
    }

    // Update address
    const { rows } = await pool.query(
      `UPDATE addresses 
       SET label = $1, name = $2, phone = $3, address = $4, city = $5, postal_code = $6, is_primary = $7, updated_at = NOW()
       WHERE id = $8 AND user_id = $9
       RETURNING id, user_id, label, name, phone, address, city, postal_code, is_primary, created_at, updated_at`,
      [label || null, name, phone, address, city || null, postal_code || null, is_primary || false, id, userId]
    );

    console.log("[ADDRESS UPDATE] Address updated");
    res.json({
      success: true,
      message: "Address updated successfully",
      address: rows[0]
    });
  } catch (err) {
    console.error("[ADDRESS UPDATE] Error:", err);
    res.status(500).json({ error: "Failed to update address" });
  }
});

// DELETE address
router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log("[ADDRESS DELETE] Deleting address:", id, "for user:", userId);

    // Check if address belongs to user
    const checkResult = await pool.query(
      "SELECT id FROM addresses WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      console.log("[ADDRESS DELETE] Address not found or unauthorized");
      res.status(404).json({ error: "Address not found" });
      return;
    }

    // Delete address
    await pool.query(
      "DELETE FROM addresses WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    console.log("[ADDRESS DELETE] Address deleted");
    res.json({
      success: true,
      message: "Address deleted successfully"
    });
  } catch (err) {
    console.error("[ADDRESS DELETE] Error:", err);
    res.status(500).json({ error: "Failed to delete address" });
  }
});

// PUT set address as primary
router.put("/:id/set-primary", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log("[ADDRESS SET PRIMARY] Setting address as primary:", id);

    // Check if address belongs to user
    const checkResult = await pool.query(
      "SELECT id FROM addresses WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      console.log("[ADDRESS SET PRIMARY] Address not found or unauthorized");
      res.status(404).json({ error: "Address not found" });
      return;
    }

    // Unset all other primary addresses for this user
    await pool.query(
      "UPDATE addresses SET is_primary = false WHERE user_id = $1",
      [userId]
    );

    // Set this address as primary
    const { rows } = await pool.query(
      `UPDATE addresses SET is_primary = true, updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, label, name, phone, address, city, postal_code, is_primary, created_at, updated_at`,
      [id, userId]
    );

    console.log("[ADDRESS SET PRIMARY] Address set as primary");
    res.json({
      success: true,
      message: "Address set as primary",
      address: rows[0]
    });
  } catch (err) {
    console.error("[ADDRESS SET PRIMARY] Error:", err);
    res.status(500).json({ error: "Failed to set address as primary" });
  }
});

export default router;
