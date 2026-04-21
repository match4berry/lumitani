const express = require('express');
const router = express.Router();

// For now, we'll use in-memory storage
// Later replace with database queries
let userCarts = {}; // { userId: [{ productId, quantity, ... }] }

// Middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized. Please login first." });
  }
  next();
};

/**
 * GET /api/cart
 * Fetch user's cart items
 */
router.get('/', checkAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Get cart items for this user
    const cart = userCarts[userId] || [];
    
    // Normalize response with consistent field names
    const normalizedItems = cart.map(item => ({
      id: item.productId,
      product_id: item.productId,
      productId: item.productId,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      photo_url: item.photo_url,
      added_at: item.added_at,
      updated_at: item.updated_at
    }));
    
    res.json({ 
      success: true,
      items: normalizedItems,
      total: normalizedItems.length 
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

/**
 * POST /api/cart/add
 * Add item to cart (or increment quantity if exists)
 */
router.post('/add', checkAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { productId, quantity = 1, name, price, photo_url } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    
    // Initialize user cart if doesn't exist
    if (!userCarts[userId]) {
      userCarts[userId] = [];
    }
    
    // Check if product already in cart
    const existingItem = userCarts[userId].find(item => item.productId === productId);
    
    if (existingItem) {
      // Increment quantity
      existingItem.quantity += parseInt(quantity) || 1;
      existingItem.updated_at = new Date();
    } else {
      // Add new item
      userCarts[userId].push({
        productId,
        quantity: parseInt(quantity) || 1,
        name: name || 'Product',
        price: parseInt(price) || 0,
        photo_url: photo_url || null,
        added_at: new Date()
      });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Item added to cart',
      cart: userCarts[userId]
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

/**
 * PUT /api/cart/:productId
 * Update cart item quantity
 */
router.put('/:productId', checkAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { productId } = req.params;
    const { quantity } = req.body;
    
    console.log('[CART-API] PUT update - userId:', userId, 'productId:', productId, 'quantity:', quantity);
    console.log('[CART-API] Current cart for user:', userCarts[userId]);
    
    if (!quantity || quantity < 1) {
      console.log('[CART-API] Invalid quantity:', quantity);
      return res.status(400).json({ error: "Invalid quantity" });
    }
    
    if (!userCarts[userId]) {
      console.log('[CART-API] Cart not found for userId:', userId);
      return res.status(404).json({ error: "Cart not found" });
    }
    
    const item = userCarts[userId].find(item => {
      console.log('[CART-API] Checking item:', item.productId, 'against:', productId, 'match:', String(item.productId) === String(productId));
      return String(item.productId) === String(productId);
    });
    
    if (!item) {
      console.log('[CART-API] Item not found in cart. Available products:', userCarts[userId].map(i => i.productId));
      return res.status(404).json({ error: "Item not found in cart" });
    }
    
    console.log('[CART-API] Found item:', item, 'setting quantity to:', quantity);
    item.quantity = parseInt(quantity);
    item.updated_at = new Date();
    
    console.log('[CART-API] Updated item:', item);
    console.log('[CART-API] Updated cart:', userCarts[userId]);
    
    res.json({ 
      success: true, 
      message: 'Quantity updated',
      item
    });
  } catch (error) {
    console.error('[CART-API] Error updating cart:', error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

/**
 * DELETE /api/cart/:productId
 * Remove item from cart
 */
router.delete('/:productId', checkAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { productId } = req.params;
    
    if (!userCarts[userId]) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    const initialLength = userCarts[userId].length;
    userCarts[userId] = userCarts[userId].filter(item => String(item.productId) !== String(productId));
    
    if (userCarts[userId].length === initialLength) {
      return res.status(404).json({ error: "Item not found in cart" });
    }
    
    res.json({ 
      success: true, 
      message: 'Item removed from cart',
      cart: userCarts[userId]
    });
  } catch (error) {
    console.error('Error deleting from cart:', error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

/**
 * DELETE /api/cart
 * Clear entire cart
 */
router.delete('/', checkAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    userCarts[userId] = [];
    
    res.json({ 
      success: true, 
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
