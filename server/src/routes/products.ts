import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// GET all products (admin view — includes inactive)
router.get("/", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT p.*,
           f.name  AS farmer_name,
           c.name  AS commodity_name,
           g.name  AS grade_name,
           cp.price AS current_price
    FROM products p
    JOIN farmers     f  ON f.id  = p.farmer_id
    JOIN commodities c  ON c.id  = p.commodity_id
    JOIN grades      g  ON g.id  = p.grade_id
    LEFT JOIN commodity_prices cp
      ON cp.grade_id  = p.grade_id
     AND cp.is_active = TRUE
     AND CURRENT_DATE BETWEEN cp.start_date AND cp.end_date
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
});

router.get("/data/:id", async(_req: Request, res: Response) => {
  let productId = _req.params.id
  
  let params = [productId]
  const {rows} = await pool.query(`
    SELECT p.*,
           f.name  AS farmer_name,
           c.name  AS commodity_name,
           g.name  AS grade_name,
           cp.price AS current_price
    FROM products p
    JOIN farmers     f  ON f.id  = p.farmer_id
    JOIN commodities c  ON c.id  = p.commodity_id
    JOIN grades      g  ON g.id  = p.grade_id
    LEFT JOIN commodity_prices cp
      ON cp.grade_id  = p.grade_id
     AND cp.is_active = TRUE
     AND CURRENT_DATE BETWEEN cp.start_date AND cp.end_date
    WHERE p.id = $1
    ORDER BY p.created_at DESC LIMIT 1
  `, params);




  
  if (rows.length == 0 ){
    res.json({
      status: 404,
      message: "Not Found"
    })
    return
  }


  let response = {
    data: {
      items: rows[0]
    }
  }
  res.json(response);
})

router.get("/data", async (_req: Request, res: Response) => {
  let commodityId = _req.query.c_id
  let response = {}

  if(commodityId){

    let params = [commodityId]
    const productQuery = pool.query(`
      SELECT p.*,
            f.name  AS farmer_name,
            c.name  AS commodity_name,
            g.name  AS grade_name,
            cp.price AS current_price
      FROM products p
      JOIN farmers     f  ON f.id  = p.farmer_id
      JOIN commodities c  ON c.id  = p.commodity_id
      JOIN grades      g  ON g.id  = p.grade_id
      LEFT JOIN commodity_prices cp
        ON cp.grade_id  = p.grade_id
      AND cp.is_active = TRUE
      AND CURRENT_DATE BETWEEN cp.start_date AND cp.end_date
      WHERE p.commodity_id = $1
      ORDER BY p.created_at DESC
    `, params);

    const commodityQuery = pool.query(`
      SELECT * FROM commodities WHERE id = $1
    `, params)


    const [rowProducts, rowCommodity] = await Promise.all([productQuery, commodityQuery]);
    
    if (rowCommodity.rowCount == 0 ){
      res.json({
        status: 404,
        message: "Not Found"
      })
      return
    }
    
    const commodity = rowCommodity.rows[0]
    const items = rowProducts.rows

    response = {commodity, items}
     
  }else{
     const {rows} = await pool.query(`
      SELECT p.*,
            f.name  AS farmer_name,
            c.name  AS commodity_name,
            g.name  AS grade_name,
            cp.price AS current_price
      FROM products p
      JOIN farmers     f  ON f.id  = p.farmer_id
      JOIN commodities c  ON c.id  = p.commodity_id
      JOIN grades      g  ON g.id  = p.grade_id
      LEFT JOIN commodity_prices cp
        ON cp.grade_id  = p.grade_id
      AND cp.is_active = TRUE
      AND CURRENT_DATE BETWEEN cp.start_date AND cp.end_date
      ORDER BY p.created_at DESC
    `);

    response = {items: rows}
  }

  
  res.json(response);
});

// GET marketplace products (only active + must have active price)
router.get("/marketplace", async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`
    SELECT p.*,
           f.name  AS farmer_name,
           c.name  AS commodity_name,
           g.name  AS grade_name,
           cp.price AS current_price
    FROM products p
    JOIN farmers     f  ON f.id  = p.farmer_id
    JOIN commodities c  ON c.id  = p.commodity_id
    JOIN grades      g  ON g.id  = p.grade_id
    JOIN commodity_prices cp
      ON cp.grade_id  = p.grade_id
     AND cp.is_active = TRUE
     AND CURRENT_DATE BETWEEN cp.start_date AND cp.end_date
    WHERE p.is_active = TRUE
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
});

// GET single product
router.get("/:id", async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT p.*,
            f.name  AS farmer_name,
            c.name  AS commodity_name,
            g.name  AS grade_name,
            cp.price AS current_price
     FROM products p
     JOIN farmers     f  ON f.id  = p.farmer_id
     JOIN commodities c  ON c.id  = p.commodity_id
     JOIN grades      g  ON g.id  = p.grade_id
     LEFT JOIN commodity_prices cp
       ON cp.grade_id  = p.grade_id
      AND cp.is_active = TRUE
      AND CURRENT_DATE BETWEEN cp.start_date AND cp.end_date
     WHERE p.id = $1`,
    [req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(rows[0]);
});

// POST create product
router.post("/", async (req: Request, res: Response) => {
  const { farmer_id, commodity_id, grade_id, name, description, stock, photo_url } =
    req.body;
  const { rows } = await pool.query(
    `INSERT INTO products (farmer_id, commodity_id, grade_id, name, description, stock, photo_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [farmer_id, commodity_id, grade_id, name, description, stock || 0, photo_url]
  );
  res.status(201).json(rows[0]);
});

// PUT update product
router.put("/:id", async (req: Request, res: Response) => {
  const { farmer_id, commodity_id, grade_id, name, description, stock, photo_url } =
    req.body;
  const { rows } = await pool.query(
    `UPDATE products
     SET farmer_id = $1, commodity_id = $2, grade_id = $3,
         name = $4, description = $5, stock = $6, photo_url = $7
     WHERE id = $8 RETURNING *`,
    [farmer_id, commodity_id, grade_id, name, description, stock, photo_url, req.params.id]
  );
  if (rows.length === 0) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(rows[0]);
});

// PATCH toggle active status
router.patch("/:id/toggle", async (req: Request, res: Response) => {
  // Check if there is an active price before activating
  const product = await pool.query("SELECT * FROM products WHERE id = $1", [
    req.params.id,
  ]);
  if (product.rows.length === 0) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const currentProduct = product.rows[0];
  const newStatus = !currentProduct.is_active;

  if (newStatus === true) {
    // Check active price exists
    const priceCheck = await pool.query(
      `SELECT id FROM commodity_prices
       WHERE grade_id = $1
         AND is_active = TRUE
         AND CURRENT_DATE BETWEEN start_date AND end_date
       LIMIT 1`,
      [currentProduct.grade_id]
    );
    if (priceCheck.rows.length === 0) {
      res
        .status(400)
        .json({ error: "Cannot activate: no active price for this grade" });
      return;
    }
  }

  const { rows } = await pool.query(
    "UPDATE products SET is_active = $1 WHERE id = $2 RETURNING *",
    [newStatus, req.params.id]
  );
  res.json(rows[0]);
});

// DELETE product
router.delete("/:id", async (req: Request, res: Response) => {
  const { rowCount } = await pool.query("DELETE FROM products WHERE id = $1", [
    req.params.id,
  ]);
  if (rowCount === 0) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ message: "Product deleted" });
});

export default router;
