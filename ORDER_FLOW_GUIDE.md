# Order Flow - Farm eCommerce Documentation

## Overview

Farm eCommerce now has a complete 3-step order flow:

```
CHECKOUT PAGE → CONFIRMATION PAGE → ORDER SUCCESS
```

## Flow Details

### Step 1: Checkout Page (`GET /checkout`)

**Route**: `GET /checkout`
**View**: `checkout.ejs`

User actions:
1. Selects shipping address:
   - From saved addresses (dynamically loaded from API)
   - Primary address auto-selected and form populated
   - OR manually enters new address
2. Selects payment method:
   - Banks: BCA, Mandiri, BNI
   - E-Wallets: DANA, OVO, GoPay
   - COD (Cash on Delivery)
3. Reviews cart items (auto-loaded)
4. Clicks "Order Now" button

**Form Data Collected**:
```
- name (Nama Penerima)
- phone (Nomor Telepon)
- address (Alamat Lengkap)
- city (Kota)
- postal (Kode Pos)
- payment (Metode Pembayaran: bca, mandiri, bni, dana, ovo, gopay, cod)
- items (JSON array of cart items)
- total (Total amount)
```

**Form Validation** (before submit):
- ✓ Name is required
- ✓ Phone is required
- ✓ Address is required
- ✓ Payment method is selected
- ✓ Cart has items

**Submit Action**: 
- `POST /order` (form action)
- Redirect to Order Confirmation page

---

### Step 2: Confirmation Page (`POST /order` → `GET /order/confirmation`)

**Route**: `POST /order` (initial)
**View**: `order-confirmation.ejs`

Backend handler (`/src/routes/order.js`):
1. Parse form data
2. Map payment value to label (bca → "Transfer Bank BCA", etc)
3. Store order data in `req.session.orderData`
4. Render confirmation page with order details

**User sees**:
- 📍 Shipping address (name, phone, full address, city, postal code)
- 💳 Payment method (with visual indicator)
- 📦 Order items (with prices and quantities)
- 💰 Total amount (highlighted)
- ⚠️ Confirmation note

**Actions on confirmation page**:
1. **Kembali Ubah** button:
   - Goes back to checkout page
   - User can modify address or payment method
   - Data is not saved yet
   
2. **Konfirmasi Pesanan** button:
   - Submits to `POST /order/confirm`
   - Creates final order record
   - Displays success page

**Data Passed**:
- All order data stored in hidden form fields
- JSON stringified items array
- Total payment amount

---

### Step 3: Order Success Page (`POST /order/confirm` → Success)

**Route**: `POST /order/confirm`
**View**: `order-success.ejs`

Backend handler:
1. Parse order data from request body
2. Create order object:
   ```javascript
   {
       id: 'ORD-' + timestamp,
       name, phone, address, city, postal,
       payment, paymentLabel,
       items: [...],
       total,
       status: "Menunggu Diproses",
       createdAt: new Date()
   }
   ```
3. Save order to `/data/orders.json`
4. Render success page with order details

**User sees**:
- ✓ Order Successful message (🎉)
- 📋 Order ID (ORD-XXXXXXX)
- 📊 Order Status
- 💰 Total Amount
- "Kembali ke Beranda" button

---

## Component Integration

### Address Selection
**File**: `/farm-ecommerce/views/checkout.ejs`
**Feature**: Dynamic address cards
- Loads from `/api/addresses` endpoint
- Requires JWT token from `/api/users/me`
- Primary address auto-selected
- User can click different address to change
- Form fields update with selected address

### Payment Methods
**File**: `/farm-ecommerce/views/checkout.ejs`
**Styling**: Professional grid layout
- Visual bank/e-wallet logos
- Hover effects (green highlight)
- Selection feedback
- Radio buttons (hidden but functional)

### Order Data Storage
**File**: `/farm-ecommerce/data/orders.json`
- Persistent storage of all orders
- Used by `/order-history` page
- Can be migrated to database later

---

## API Endpoints Used

### Frontend → Backend Session (Port 8080)
```
GET /api/users/me
  → Returns: { token, user: { id, email, name } }
  → Used to get JWT token from session

POST /order
  → Form submission with all checkout data
  → Returns confirmation page

POST /order/confirm
  → Final order confirmation
  → Creates order record
  → Returns success page
```

### Frontend → Backend API (Port 5001)
```
GET /api/addresses (via JavaScript)
  → Fetch user's saved addresses
  → Requires JWT token
  → Used in checkout to show address cards
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CART PAGE                                │
│        User adds items, proceeds to checkout                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              CHECKOUT PAGE (/checkout)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. Load cart items (JS fetch /api/cart)             │  │
│  │ 2. Load auth token (JS fetch /api/users/me)         │  │
│  │ 3. Load saved addresses (JS fetch /api/addresses)   │  │
│  │ 4. Display address cards (select or enter new)      │  │
│  │ 5. Display payment methods (grid visual)            │  │
│  │ 6. User validates form & clicks "Order Now"         │  │
│  └──────────────────────────────────────────────────────┘  │
│               Form validation (JS)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓ POST /order
┌─────────────────────────────────────────────────────────────┐
│         CONFIRMATION PAGE (/order-confirmation)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Backend: Parse data, map payment label              │  │
│  │ Backend: Store in session.orderData                 │  │
│  │ Frontend: Display address, payment, items, total    │  │
│  │ User chooses:                                       │  │
│  │ • "Kembali Ubah" → back to /checkout               │  │
│  │ • "Konfirmasi Pesanan" → POST /order/confirm        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓ POST /order/confirm
┌─────────────────────────────────────────────────────────────┐
│              ORDER SUCCESS PAGE                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Backend: Create order object                        │  │
│  │ Backend: Save to /data/orders.json                  │  │
│  │ Backend: Render success page                        │  │
│  │ Frontend: Show Order ID, Status, Total              │  │
│  │ Frontend: "Kembali ke Beranda" button               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## File Locations

- **Routes**: `/farm-ecommerce/src/routes/order.js`
- **Checkout View**: `/farm-ecommerce/views/checkout.ejs`
- **Confirmation View**: `/farm-ecommerce/views/order-confirmation.ejs`
- **Success View**: `/farm-ecommerce/views/order-success.ejs`
- **Orders Data**: `/farm-ecommerce/data/orders.json`

---

## Payment Method Mapping

| Value  | Label                  | Category  |
|--------|------------------------|-----------|
| bca    | Transfer Bank BCA      | Banks     |
| mandiri| Transfer Bank Mandiri  | Banks     |
| bni    | Transfer Bank BNI      | Banks     |
| dana   | E-Wallet DANA          | E-Wallet  |
| ovo    | E-Wallet OVO           | E-Wallet  |
| gopay  | E-Wallet GoPay         | E-Wallet  |
| cod    | Bayar di Tempat (COD)  | Other     |

---

## Form Field Requirements

### Checkout Form Fields (Required/Optional)

| Field      | Required | Type      | Notes                                    |
|------------|----------|-----------|------------------------------------------|
| name       | ✓ YES    | text      | Recipient name                          |
| phone      | ✓ YES    | text      | Phone number                            |
| address    | ✓ YES    | textarea  | Full address                            |
| city       | ○ NO     | text      | City name                               |
| postal     | ○ NO     | text      | Postal code                             |
| payment    | ✓ YES    | radio     | Must select one method                  |
| items      | ✓ YES    | hidden    | Auto-populated from cart                |
| total      | ✓ YES    | hidden    | Auto-calculated from items              |

---

## Testing Checklist

- [ ] Login to farm-ecommerce
- [ ] Add items to cart
- [ ] Go to checkout page
- [ ] Verify saved addresses load and display
- [ ] Select saved address or enter new address
- [ ] Verify form fields populate with address data
- [ ] Select payment method
- [ ] Click "Order Now"
- [ ] Verify confirmation page shows all data correctly
- [ ] Click "Kembali Ubah" and verify can modify
- [ ] Click "Konfirmasi Pesanan"
- [ ] Verify success page displays with Order ID
- [ ] Verify order saved to `/data/orders.json`
- [ ] Verify order appears in order history page

---

## Next Steps

1. **Database Integration**: Migrate orders from JSON to PostgreSQL
2. **Payment Gateway**: Integrate actual payment processing for each method
3. **Email Notifications**: Send confirmation email with order details
4. **Order Tracking**: Add tracking page with real-time status updates
5. **Admin Dashboard**: Order management system for admins
6. **Invoice Generation**: PDF invoice download from order history
