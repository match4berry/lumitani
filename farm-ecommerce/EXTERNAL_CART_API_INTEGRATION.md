# External Cart API Integration Guide

## 🔧 What Was Fixed

The cart system now properly integrates with your external cart API at `https://lumitani.elcyone.my.id/api/cart` with user authentication using numeric user IDs.

### Issues Resolved:
1. ❌ **Old**: `req.session.userId` was set to email address
   ✅ **New**: `req.session.userId` is now a numeric ID from the database

2. ❌ **Old**: Cart calls were to local `/api/cart` endpoint
   ✅ **New**: All cart calls go to external `CART_API_URL` with proper authentication

3. ❌ **Old**: No database connection for user management
   ✅ **New**: PostgreSQL connection created for storing and retrieving user data

---

## 📋 Changes Made

### 1. Database Connection Created
**File:** `src/db.js`
- Establishes PostgreSQL connection using environment variables
- Used by registration and login for user persistence

### 2. User Authentication Updated
**File:** `src/server.js`
- **Registration POST**: Now inserts user into database, retrieves numeric ID
- **Login POST**: Queries database by email, retrieves numeric ID
- Session now stores:
  - `req.session.userId` (numeric ID)
  - `req.session.userEmail` (email)
  - `req.session.userName` (name)

### 3. Configuration API Endpoint
**File:** `src/server.js`
- **New Endpoint:** `GET /api/config`
- Returns to frontend:
  ```json
  {
    "cartApiUrl": "https://lumitani.elcyone.my.id/api/cart",
    "userId": 123,
    "userName": "user_name",
    "userEmail": "user@email.com"
  }
  ```

### 4. Frontend Cart Integration
**File:** `public/js/cart.js` (Rewritten)
- Calls `/api/config` first to get cart API URL and numeric user_id
- All cart operations call external API:
  - `GET ${cartApiUrl}?user_id=${userId}` - Fetch cart
  - `PUT ${cartApiUrl}/${productId}` - Update quantity
  - `DELETE ${cartApiUrl}/${productId}` - Remove item
- Authentication: Passes `Authorization: Bearer ${userId}` header
- Handles 401 unauthorized with login redirect

### 5. Add-to-Cart Updated
**Files:**
- `public/js/product-detail.js` 
- `views/catalog.ejs`

Both now:
- Call `/api/config` to get user_id and cart API URL
- Use external cart API at configured URL
- Send user_id in request body and Authorization header
- Redirect to login if not authenticated

---

## ⚙️ Environment Setup

Create or update your `.env` file:

```bash
# Product API
API_URL=https://cms-lumitani.elcyone.my.id

# Cart API (External)
CART_API_URL=https://lumitani.elcyone.my.id/api/cart

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=farm_ecommerce

# Session Secret
SESSION_SECRET=lumitani-secret-key

# Server Port
PORT=8080
```

### Database Requirements

The database must have a `users` table:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 How It Works Now

### User Registration Flow:
1. User fills registration form
2. Server validates and inserts into `users` table
3. Database returns numeric `id`
4. Session stores: `userId` (numeric ID), `userEmail`, `userName`
5. User redirected to `/home`

### User Login Flow:
1. User enters email/password
2. Server queries `users` table by email
3. If found, retrieves numeric `id`
4. Session stores: `userId` (numeric ID), `userEmail`, `userName`
5. User redirected to `/home`

### Add to Cart Flow (Cart Page, PDP, Catalog):
1. User clicks "Add to Cart"
2. JavaScript calls `/api/config` to get:
   - External cart API URL
   - Numeric user_id from session
3. JavaScript calls external cart API:
   ```
   POST ${cartApiUrl}/add
   Header: Authorization: Bearer ${userId}
   Body: { user_id, productId, quantity, name, price, photo_url }
   ```
4. If 401 → Redirect to login
5. If success → Show confirmation message

### Cart Page Load Flow:
1. Page loads, calls `loadConfig()`
2. Gets cart API URL and numeric user_id
3. Calls: `GET ${cartApiUrl}?user_id=${userId}`
4. External API returns items list
5. Frontend renders dynamic cart with items

---

## 📡 API Integration Points

### From Frontend → Your External Cart API:

```javascript
// Get cart
GET https://lumitani.elcyone.my.id/api/cart?user_id=123
Header: Authorization: Bearer 123

// Add item
POST https://lumitani.elcyone.my.id/api/cart/add
Header: Authorization: Bearer 123
Body: {
  user_id: 123,
  productId: 5,
  quantity: 1,
  name: "Produk Name",
  price: 15000,
  photo_url: "..."
}

// Update quantity
PUT https://lumitani.elcyone.my.id/api/cart/5
Header: Authorization: Bearer 123
Body: { quantity: 2, user_id: 123 }

// Delete item
DELETE https://lumitani.elcyone.my.id/api/cart/5
Header: Authorization: Bearer 123
Body: { user_id: 123 }
```

---

## ✅ Next Steps

### 1. Configure .env File
Set all database and API URLs in `.env` file

### 2. Create Users Table in Database
Execute the SQL from the Database Requirements section

### 3. Test Registration
- Register a new user
- Check `users` table to verify numeric ID is stored
- Verify session has numeric userId

### 4. Test Login
- Login with valid credentials
- Verify session has numeric userId
- Check browser cookies for session_id

### 5. Test Add to Cart
- Login → Go to catalog
- Add a product to cart
- Verify requests go to external `https://lumitani.elcyone.my.id/api/cart`
- Verify cart items appear

### 6. Test Cart Page
- Add items then visit `/cart`
- Verify items load from external API
- Test quantity updates and deletion

---

## 🔍 Debugging

###Check if user is registered:
```bash
# Connect to database
psql -U postgres -d farm_ecommerce

# Check users table
SELECT * FROM users;
```

### Check API calls:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Add to cart and watch requests
4. Should see requests to `https://lumitani.elcyone.my.id/api/cart`

### Check browser console:
- DevTools → Console
- Look for any JavaScript errors
- Cart.js logs errors with `console.error()`

### Check server logs:
- Server output shows registration/login successes/failures
- Database errors appear in server console

---

## 📊 Session Data Structure

After login/registration, `req.session` contains:

```javascript
{
  userId: 123,           // Numeric ID from database
  userEmail: 'user@email.com',
  userName: 'User Name',
  cookie: { maxAge: ... }
}
```

This `userId` is passed to external cart API in:
- Query params: `?user_id=${userId}`
- Authorization header: `Bearer ${userId}`
- Request body: `{ user_id: userId, ... }`

---

## 🎯 Files Modified

1. ✅ `src/db.js` - PostgreSQL connection (NEW)
2. ✅ `src/server.js` - Auth, config endpoint, database integration
3. ✅ `public/js/cart.js` - External API calls
4. ✅ `public/js/product-detail.js` - External API calls
5. ✅ `views/catalog.ejs` - External API calls

---

## 📝 Notes

- Frontend now requires `/api/config` endpoint to know the cart API URL
- All cart operations require authentication (numeric userId)
- External cart API is called directly from browser (CORS must be enabled)
- Session is maintained via cookies
- Database is required for user persistence
- Email addresses must be unique in users table

---

## ⚠️ Important

Make sure:
1. PostgreSQL is running and accessible
2. Database and users table exist
3. `.env` file configured with correct credentials
4. External cart API is accessible and returns data in expected format
5. CORS is enabled on external cart API to accept browser requests

