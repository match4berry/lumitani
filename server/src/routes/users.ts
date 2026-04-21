import { Router, Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";
import { generateToken, verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();

// ===== AUTHENTICATION ROUTES =====

// POST register new user
router.post("/register", async (req: Request, res: Response) => {
  console.log("[REGISTER] Request received:", req.body);
  const { name, email, password, phone, address } = req.body;

  // Validation
  if (!name || !email || !password) {
    console.log("[REGISTER] Validation failed: missing fields");
    res.status(400).json({ error: "name, email, and password are required" });
    return;
  }

  if (password.length < 6) {
    console.log("[REGISTER] Password too short");
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  try {
    console.log("[REGISTER] Checking if email exists...");
    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log("[REGISTER] Email already exists");
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    console.log("[REGISTER] Hashing password...");
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[REGISTER] Password hashed, inserting user...");

    // Create user
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, phone, address, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, address, role, is_active, created_at, updated_at`,
      [name, email, hashedPassword, phone || null, address || null, "user"]
    );

    const user = rows[0];
    console.log("[REGISTER] User created, generating token...");

    // Generate token
    const token = generateToken(user.id, user.email, user.name);
    console.log("[REGISTER] Token generated, sending response...");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token
    });
    console.log("[REGISTER] Response sent");
  } catch (err) {
    console.error("[REGISTER] Error:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// POST login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  try {
    // Find user by email
    const { rows } = await pool.query(
      "SELECT id, name, email, password, role, is_active FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = rows[0];

    // Check if user is active
    if (!user.is_active) {
      res.status(403).json({ error: "User account is inactive" });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Update last_login
    await pool.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id, user.email, user.name);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// POST logout (frontend typically just discards token, but can be used for token blacklist)
router.post("/logout", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      success: true,
      message: "Logout successful"
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Failed to logout" });
  }
});

// GET current user profile
router.get("/me", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, phone, address, role, is_active, created_at, updated_at, last_login FROM users WHERE id = $1",
      [req.userId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// POST change password
router.post("/change-password", verifyToken, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match" });
    return;
  }

  try {
    // Get current user password
    const { rows } = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.userId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, rows[0].password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, req.userId]
    );

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// ===== USER MANAGEMENT ROUTES =====

router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, phone, address, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC"
  );
  res.json(rows);
});

// GET single user
router.get("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, phone, address, role, is_active, created_at, updated_at FROM users WHERE id = $1",
    [req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(rows[0]);
});

// POST create user
router.post("/", async (req: Request, res: Response) => {
  const { name, email, phone, address, role } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, phone, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, address, role, is_active, created_at, updated_at`,
      [name, email, phone || null, address || null, role || "user"]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    throw err;
  }
});

// PUT update user
router.put("/:id", async (req: Request, res: Response) => {
  const { name, email, phone, address, role, is_active } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users SET name = $1, email = $2, phone = $3, address = $4, role = $5, is_active = $6
       WHERE id = $7
       RETURNING id, name, email, phone, address, role, is_active, created_at, updated_at`,
      [name, email, phone || null, address || null, role || "user", is_active ?? true, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    throw err;
  }
});

// DELETE user
router.delete("/:id", async (req: Request, res: Response) => {
  const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [
    req.params.id,
  ]);
  if (rowCount === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ message: "User deleted" });
});

export default router;
