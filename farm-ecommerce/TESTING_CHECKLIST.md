# Cart API Integration - Quick Checklist

## ✅ Pre-Deployment Checklist

### Database Setup
- [ ] PostgreSQL server is running
- [ ] Database `farm_ecommerce` exists
- [ ] `users` table is created with schema:
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

### Environment Configuration
- [ ] `.env` file exists in `farm-ecommerce/` directory
- [ ] `API_URL` set correctly: `https://cms-lumitani.elcyone.my.id`
- [ ] `CART_API_URL` set correctly: `https://lumitani.elcyone.my.id/api/cart`
- [ ] `DB_HOST` set correctly
- [ ] `DB_USER` set correctly
- [ ] `DB_PASSWORD` set correctly
- [ ] `DB_NAME` set to `farm_ecommerce`
- [ ] `SESSION_SECRET` set

### Dependencies
- [ ] npm dependencies installed: `npm install`
- [ ] `pg` package installed (for PostgreSQL)
- [ ] `express-session` installed
- [ ] `dotenv` installed

### Files Modified/Created
- [ ] `src/db.js` exists (database connection)
- [ ] `src/server.js` updated with:
  - Pool import
  - Registration async/database integration
  - Login async/database integration
  - `/api/config` endpoint
- [ ] `public/js/cart.js` rewritten for external API
- [ ] `public/js/product-detail.js` updated
- [ ] `views/catalog.ejs` updated

---

## 🧪 Testing Steps

### Test 1: Server Starts Without Errors
```bash
npm start
# or
node src/server.js
```
✅ Should not have database connection errors
✅ Should not have require errors

### Test 2: Registration Creates User in Database
1. Navigate to `/registration`
2. Fill form with:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `testpass123`
   - Confirm: `testpass123`
3. Submit form
4. Should redirect to `/home`
5. Verify in database:
   ```bash
   psql -U postgres -d farm_ecommerce -c "SELECT * FROM users WHERE email='test@example.com';"
   ```
   ✅ Should return one row with numeric ID

### Test 3: Login Works with Numeric ID
1. Open new browser (clear cookies)
2. Navigate to `/login`
3. Enter: email `test@example.com`, password `testpass123`
4. Submit form
5. Should redirect to `/home`
6. Check browser console:
   - No JavaScript errors
   - Session should be set (check cookies: `connect.sid`)

### Test 4: `/api/config` Returns Correct Data
1. After logged in, open browser console
2. Run:
   ```javascript
   fetch('/api/config').then(r => r.json()).then(d => console.log(d))
   ```
3. ✅ Should return:
   ```json
   {
     "cartApiUrl": "https://lumitani.elcyone.my.id/api/cart",
     "userId": 123,
     "userName": "Test User",
     "userEmail": "test@example.com"
   }
   ```

### Test 5: Cart Page Loads
1. After login, go to `/catalog`
2. Do NOT add anything yet
3. Navigate to `/cart`
4. ✅ Should show "Keranjang Anda kosong" or Loading message
5. ✅ Browser console Network tab should show request to `https://lumitani.elcyone.my.id/api/cart?user_id=123`

### Test 6: Add to Cart from Catalog
1. Go to `/catalog`
2. Click "Add to Cart" button on any product
3. ✅ Should show: "Produk berhasil ditambahkan ke keranjang!"
4. Check Network tab:
   - ✅ Should see POST to `https://lumitani.elcyone.my.id/api/cart/add`
   - ✅ Request should include Authorization header and user_id in body

### Test 7: Add to Cart from Product Detail
1. Go to `/catalog`
2. Click product name to go to product detail page
3. Click "Add to Cart" button
4. ✅ Should show: "Produk berhasil ditambahkan ke keranjang!"
5. Check Network tab:
   - ✅ Should see POST to `https://lumitani.elcyone.my.id/api/cart/add`

### Test 8: Cart Page Displays Items
1. After adding 2-3 products, go to `/cart`
2. ✅ Should display all added items with:
   - Product image
   - Product name
   - Price per unit
   - Quantity controls (+/- buttons)
   - Total price for item
   - Delete button
3. ✅ Cart summary should show total price and item count

### Test 9: Update Quantity
1. On `/cart`, change quantity of an item
2. After input loses focus (onchange triggers)
3. ✅ Network tab should show PUT request to `https://lumitani.elcyone.my.id/api/cart/{productId}`
4. ✅ Item total should recalculate
5. ✅ Cart summary should update

### Test 10: Delete Item
1. On `/cart`, click delete (trash icon) button
2. ✅ Should show confirmation: "Yakin ingin menghapus item ini?"
3. Click OK
4. ✅ Network tab should show DELETE request
5. ✅ Item should disappear from cart
6. ✅ If last item deleted, should show "Keranjang Anda kosong"

### Test 11: Logout and Redirect
1. Click logout (if available in UI or go to `/logout`)
2. ✅ Should redirect to `/`
3. Try to access `/cart`
4. ✅ Should show login prompt (or redirect to `/login`)

### Test 12: Non-Logged User Can't Add to Cart
1. Clear cookies or open incognito window
2. Try to add to cart from catalog
3. ✅ Should show: "Silakan login terlebih dahulu"
4. ✅ Should redirect to `/login`

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot find module 'pg'"
**Fix:** Install PostgreSQL package
```bash
npm install pg
```

### Issue: "ECONNREFUSED" when starting server
**Fix:** PostgreSQL is not running
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Manual start
pg_ctl -D /usr/local/var/postgres start
```

### Issue: "database farm_ecommerce does not exist"
**Fix:** Create database
```bash
createdb farm_ecommerce
```

### Issue: "duplicate key value violates unique constraint"
**Fix:** Email already exists in database
```bash
# Use different email for testing
# Or delete existing user:
psql -U postgres -d farm_ecommerce -c "DELETE FROM users WHERE email='test@example.com';"
```

### Issue: Cart returns empty even when logged in
**Fix:** Check:
1. User ID being sent to cart API
2. External cart API URL in `.env`
3. Network tab to verify requests are going to correct URL
4. External cart API is responding with data

### Issue: API calls fail with 401
**Fix:** 
1. Check if user_id is being passed in Authorization header
2. Verify external cart API expects Bearer token format
3. Check if user_id in database matches what API expects

### Issue: CORS errors when calling external API
**Fix:** 
1. Request must include `credentials: 'include'` (already done in new code)
2. External API must have CORS headers: `Access-Control-Allow-Origin: *`
3. Contact API provider to enable CORS

---

## 📊 Success Criteria

✅ All tests 1-12 pass
✅ No console errors in browser DevTools
✅ All network requests go to external cart API
✅ User data persists in database
✅ Session works correctly
✅ Cart functionality works as expected
✅ Logout/login works properly

---

## 📞 Support Resources

- Check `.env` configuration
- Review `EXTERNAL_CART_API_INTEGRATION.md` for architecture
- Check browser DevTools Network tab for API request details
- Check server console for backend errors
- Verify database connection with direct PostgreSQL queries
- Enable `console.log()` in `src/server.js` for debugging

