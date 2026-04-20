# Cart API Setup Guide

## ✅ Completed Steps

### 1. Database Migration File Created
**File**: `src/migrations/001_create_cart_items_table.sql`

Creates PostgreSQL table for cart persistence with:
- `id` (SERIAL PRIMARY KEY)
- `user_id` (FK to users table)
- `product_id` (FK to products table)
- `quantity` (INTEGER)
- `added_at` & `updated_at` (TIMESTAMP with auto-update)
- UNIQUE constraint on (user_id, product_id)
- Indexes for performance

### 2. Cart API Routes Created
**File**: `src/routes/cart.js`

Implements 5 RESTful endpoints:
- **GET /api/cart** - Fetch user's cart items
- **POST /api/cart/add** - Add/increment item in cart
- **PUT /api/cart/:productId** - Update item quantity
- **DELETE /api/cart/:productId** - Remove item from cart
- **DELETE /api/cart** - Clear entire cart

All endpoints require authentication via `checkAuth` middleware (validates session.userId).

Currently uses in-memory storage (will be replaced with PostgreSQL queries).

### 3. Server Routes Updated
**File**: `src/server.js`

Changes:
- ✅ Added import: `const cartRoutes = require('./routes/cart');`
- ✅ Registered routes: `app.use('/api/cart', cartRoutes);`
- ✅ Removed old conflicting endpoints (`/api/cart/add`, `/api/cart/remove`)
- ✅ Updated `/cart` route to render empty template (populated by API)

### 4. Frontend API Integration

#### `public/js/cart.js` - Completely Rewritten
- ✅ New async/await implementation
- ✅ Fetches cart from `/api/cart` on page load
- ✅ Renders items dynamically with API data
- ✅ Calls `PUT /api/cart/:productId` for quantity updates
- ✅ Calls `DELETE /api/cart/:productId` for item removal
- ✅ Handles 401 unauthorized with login redirect
- ✅ Removed all localStorage code (now API-driven)

#### `public/js/product-detail.js` - Updated
- ✅ Changed `addToCart()` to async function
- ✅ Now calls `POST /api/cart/add` instead of localStorage
- ✅ Handles 401 with login redirect
- ✅ Passes product data: `productId`, `name`, `price`, `photo_url`

#### `views/catalog.ejs` - Updated
- ✅ Updated inline `addToCart()` function to use API
- ✅ Now accepts parameters: `productId`, `productName`, `productPrice`, `productImage`
- ✅ Calls `POST /api/cart/add` endpoint
- ✅ Shows login redirect on 401

#### `views/cart.ejs` - Already Updated
- ✅ Replaced server-side EJS loops with dynamic container
- ✅ `<div id="cartItemsContainer">` for JavaScript rendering
- ✅ Dynamic cart summary calculation

---

## 🚀 Next Steps to Complete Setup

### Step 1: Run Database Migration

Execute this command to create the cart_items table:

```bash
cd /Users/rismanda/Lumitani/lumitani/farm-ecommerce

# Option A: Using psql directly (if credentials configured)
psql -U postgres -d farm_ecommerce -f src/migrations/001_create_cart_items_table.sql

# Option B: Use your preferred PostgreSQL client
# Open the migration file and execute the SQL
```

**Verify migration was successful:**
```bash
psql -U postgres -d farm_ecommerce -c "\dt cart_items"
```

You should see the cart_items table.

### Step 2: Update Backend Cart Routes (Optional - for persistence)

The cart API currently uses in-memory storage. To persist to PostgreSQL:

**In `src/routes/cart.js`**:
1. Import PostgreSQL connection: `const pool = require('../db');` (or your pool instance)
2. Replace `let userCarts = {}` with database queries
3. Update each route handler to use `pool.query()`

Example for GET route:
```javascript
router.get('/', checkAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const result = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true, items: result.rows });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});
```

### Step 3: Test the Complete Flow

1. **Start the server:**
   ```bash
   node src/server.js
   # or npm start if configured
   ```

2. **Test user journey:**
   - Navigate to `/registration` or `/login`
   - Register a new user or login
   - Go to `/catalog` and add products to cart
   - Visit `/cart` to verify items appear
   - Test quantity updates
   - Test item removal
   - Test checkout flow

3. **Test authentication:**
   - Try adding to cart without logging in
   - Should redirect to login with message
   - After login, should add successfully

---

## 📋 API Endpoint Reference

### GET /api/cart
**Authentication**: Required (session.userId)

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "productId": 1,
      "name": "Tomato",
      "price": 15000,
      "quantity": 2,
      "photo_url": "...",
      "added_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T11:45:00Z"
    }
  ],
  "total": 1
}
```

### POST /api/cart/add
**Authentication**: Required

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 1,
  "name": "Tomato",
  "price": 15000,
  "photo_url": "..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": [...]
}
```

### PUT /api/cart/:productId
**Authentication**: Required

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quantity updated",
  "item": {...}
}
```

### DELETE /api/cart/:productId
**Authentication**: Required

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": [...]
}
```

### DELETE /api/cart
**Authentication**: Required

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## 🔧 File Locations

- Migration: `/src/migrations/001_create_cart_items_table.sql`
- Routes: `/src/routes/cart.js`
- Server: `/src/server.js` (lines where cart routes registered)
- Frontend JS: `/public/js/cart.js` (completely rewritten)
- Frontend JS: `/public/js/product-detail.js` (updated)
- Templates: `/views/catalog.ejs` (updated)
- Templates: `/views/cart.ejs` (already updated)

---

## ✨ Key Features

✅ **Session-based authentication** - Each user has isolated cart via session.userId
✅ **RESTful API design** - Follows REST conventions (GET, POST, PUT, DELETE)
✅ **Error handling** - Proper HTTP status codes (401, 400, 404, 500)
✅ **Quantity management** - Auto-increments if item exists in cart
✅ **Dynamic rendering** - Cart page updates without page reload
✅ **Login redirect** - Non-authenticated users redirected to login
✅ **Clean code** - Removed all localStorage dependency

---

## 🐛 Troubleshooting

### "Unauthorized. Please login first." error
- User needs to login first
- Check that session.userId is set after login
- Verify express-session is configured

### Items not persisting after refresh
- This is expected with current in-memory storage
- To persist: Complete Step 2 (connect to PostgreSQL)
- Migration file is ready when database is connected

### API endpoint returns 404
- Verify `app.use('/api/cart', cartRoutes)` is in server.js
- Check that cartRoutes import is correct: `require('./routes/cart')`
- Restart server after code changes

### In-browser errors
- Check browser console (F12 Developer Tools)
- Verify API endpoint URLs match exactly
- Check session cookie is being sent with requests

---

## 📝 Notes

- All cart operations now go through the API (no localStorage)
- Session-based cart means user context per browser session
- Migration file includes auto-updating timestamps
- API follows products.ts pattern for consistency
- Next step after PostgreSQL integration: Order history persistence

