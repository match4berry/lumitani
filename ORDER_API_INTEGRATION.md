# Order API Integration Guide - Farm eCommerce & Backend API

## Overview

Orders created on farm-ecommerce are now synchronized with the backend API (port 5001) and accessible through the React client (manajemen-pesanan page).

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   FARM-ECOMMERCE (Port 8080)                    │
│                                                                 │
│  Checkout → Confirmation → Order Creation                       │
│                               ↓                                  │
│                         POST /order/confirm                      │
│                               ↓ (transforms data)               │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ 1. Save to /data/orders.json (local backup)          │        │
│  │ 2. POST to Backend API /api/orders                   │        │
│  └─────────────────────────────────────────────────────┘        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓ HTTP POST
┌──────────────────────────────────────────────────────────────────┐
│              BACKEND API SERVER (Port 5001)                      │
│                                                                  │
│  POST /api/orders                                               │
│    ↓ Validate & Process                                         │
│    ├─ Generate order_code                                       │
│    ├─ Calculate totals & commission                             │
│    ├─ Validate product stock                                    │
│    ├─ Reduce product stock                                      │
│    └─ Save to PostgreSQL orders table                           │
│                                                                  │
│  GET /api/orders                                                │
│  GET /api/orders/:id                                            │
│  GET /api/orders/summary                                        │
│  PATCH /api/orders/:id/status                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓ API Calls
┌──────────────────────────────────────────────────────────────────┐
│            REACT CLIENT (manajemen-pesanan page)                 │
│                                                                  │
│  - Fetch & display all orders                                   │
│  - Show order status summary                                    │
│  - Search/filter orders                                         │
│  - View detailed order items                                    │
│  - Update order status (sequential: waiting → processing →      │
│    shipped → completed)                                         │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Farm-eCommerce OrderCreation Flow

**Checkout Form Collects**:
```javascript
{
  name: "John Doe",           // Nama Penerima
  phone: "081234567890",      // Nomor Telepon
  address: "Jl. Merdeka 123", // Alamat Lengkap
  city: "Jakarta",            // Kota
  postal: "12345",            // Kode Pos
  payment: "gopay",           // Metode Pembayaran (value)
  items: [
    {
      product_id: 5,          // From cart API
      name: "Bayam Organik",
      price: 15000,
      quantity: 2
    },
    ...
  ],
  total: 45000                // Total amount
}
```

**Confirmation Page**:
- Displays all data for user verification
- User can go back to edit or confirm

**Order Creation** (`POST /order/confirm`):

1. **Local Save**: Save to `/farm-ecommerce/data/orders.json`
   ```json
   {
     "id": "ORD-1713696000000",
     "name": "John Doe",
     "phone": "081234567890",
     "address": "Jl. Merdeka 123",
     "city": "Jakarta",
     "postal": "12345",
     "payment": "gopay",
     "items": [...],
     "total": 45000,
     "status": "Menunggu Diproses",
     "createdAt": "2026-04-22T14:30:00.000Z"
   }
   ```

2. **API Send**: POST to `http://localhost:5001/api/orders` with transformed data
   ```json
   {
     "customer_name": "John Doe",
     "pengiriman": "Jl. Merdeka 123",
     "no_hp": "081234567890",
     "metode_pembayaran": "E-Wallet GoPay",
     "user_id": 5,
     "items": [
       {
         "product_id": 5,
         "quantity": 2,
         "unit_price": 15000,
         "subtotal": 30000
       },
       ...
     ]
   }
   ```

### 2. Backend API Order Processing

**POST /api/orders** (`/server/src/routes/orders.ts`):

1. **Validation**:
   - Verify customer_name and items array
   - Check each product exists and is active
   - Verify stock availability

2. **Processing** (in transaction):
   - Generate order_code: `ORD-20260422-00001`
   - Calculate total from item prices
   - Fetch commission rate (default 5%)
   - Calculate commission_amount
   - Insert order into `orders` table
   - Insert order items into `order_items` table
   - Reduce product stock for each item

3. **Response**:
   ```json
   {
     "id": 123,
     "order_code": "ORD-20260422-00001",
     "customer_name": "John Doe",
     "total_price": "45000",
     "status": "menunggu_proses",
     "commission_rate": 5.0,
     "commission_amount": "2250",
     "pengiriman": "Jl. Merdeka 123",
     "no_hp": "081234567890",
     "metode_pembayaran": "E-Wallet GoPay",
     "user_id": 5,
     "order_date": "2026-04-22",
     "created_at": "2026-04-22T14:30:00.000Z",
     "items": [
       {
         "id": 456,
         "order_id": 123,
         "product_id": 5,
         "quantity": 2,
         "unit_price": "15000",
         "subtotal": "30000"
       },
       ...
     ]
   }
   ```

### 3. React Client Display

**OrdersPage Component** (`/client/src/pages/OrdersPage.tsx`):

**API Calls**:
```typescript
// Load all orders
GET /api/orders
Response: Order[]

// Get order status summary
GET /api/orders/summary
Response: { menunggu_proses: 15, diproses: 8, dikirim: 3, selesai: 24 }

// Get single order details with items
GET /api/orders/:id
Response: Order (with items array)

// Update order status
PATCH /api/orders/:id/status
Body: { status: "diproses" }
Response: Order (updated)
```

**Display Features**:
- List all orders with order_code, customer_name, total_price, status
- Status badges: Menunggu Proses (gray), Diproses (blue), Dikirim (red), Selesai (green)
- Search by order_code or customer_name
- Filter by status
- Pagination (5 items per page)
- Click to show detailed items, total calculation
- Update status (sequential only: menunggu_proses → diproses → dikirim → selesai)

## Database Schema

### orders table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'menunggu_proses',
  commission_rate DECIMAL(5,2),
  commission_amount DECIMAL(12,2),
  user_id INTEGER REFERENCES users(id),
  pengiriman TEXT,
  no_hp VARCHAR(20),
  metode_pembayaran VARCHAR(100),
  order_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### order_items table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Farm-eCommerce (Port 8080)

```
POST /order/confirm
├─ Input: Form data from order-confirmation.ejs
├─ Processing:
│  ├─ Save to local file: /data/orders.json
│  └─ POST to backend API: http://localhost:5001/api/orders
└─ Returns: order-success.ejs page
```

### Backend API (Port 5001)

```
GET /api/orders
├─ Optional Query: ?user_id=X
├─ Returns: Order[]
└─ Example: GET /api/orders OR GET /api/orders?user_id=5

GET /api/orders/summary
├─ Returns: { menunggu_proses: N, diproses: N, dikirim: N, selesai: N }
└─ Example: GET /api/orders/summary

GET /api/orders/:id
├─ Returns: Order with items array
├─ Example: GET /api/orders/123
└─ Response includes user_name (from LEFT JOIN with users)

POST /api/orders
├─ Required: customer_name, items[]
├─ Optional: user_id, pengiriman, no_hp, metode_pembayaran
├─ Processing: Transaction with stock validation & reduction
└─ Returns: Created 201 with Order object

PATCH /api/orders/:id/status
├─ Required: status (must be next sequential status)
├─ Status Flow: menunggu_proses → diproses → dikirim → selesai
├─ Example: PATCH /api/orders/123/status with { "status": "diproses" }
└─ Returns: Updated Order object
```

## Content Type Mapping

### farm-ecommerce payment values → Backend labels:
- `bca` → "Transfer Bank BCA"
- `mandiri` → "Transfer Bank Mandiri"
- `bni` → "Transfer Bank BNI"
- `dana` → "E-Wallet DANA"
- `ovo` → "E-Wallet OVO"
- `gopay` → "E-Wallet GoPay"
- `cod` → "Bayar di Tempat (COD)"

### Backend status values → React labels:
- `menunggu_proses` → "Menunggu Proses"
- `diproses` → "Diproses"
- `dikirim` → "Dikirim"
- `selesai` → "Selesai"

## Error Handling

### Farm-eCommerce
- **Backend API unavailable**: Order still saved to local file, user gets success page
- **Local save fails**: Logged to console, user gets success page anyway
- **Missing product_id**: Items filtered out, only items with product_id sent to API

### Backend API
```
POST /api/orders errors:
- 400: Missing customer_name or items
- 400: Item has no valid product_id or quantity
- 400: Product not found or no active price
- 400: Insufficient stock
- 500: Database error

PATCH /api/orders/:id/status errors:
- 400: Invalid status value
- 400: Status not in correct sequential order
- 404: Order not found
```

### React Client
- API errors display in alert banner
- Retry on failed API calls
- Form validation before submission

## Testing Workflow

### 1. Create Order (Farm-eCommerce)
```bash
# Step 1: Login & add to cart
# Visit http://localhost:8080/login
# Add items to cart via /catalog

# Step 2: Checkout
# Go to http://localhost:8080/checkout
# Select/enter address
# Select payment method
# Click "Order Now"

# Step 3: Confirm
# Review order on confirmation page
# Click "Konfirmasi Pesanan"

# Step 4: Success
# See order confirmation page
```

### 2. Verify in Database
```bash
# Check orders were created
SELECT * FROM orders WHERE customer_name = 'John Doe';

# Check order items
SELECT oi.*, p.name 
FROM order_items oi
JOIN products p ON p.id = oi.product_id
WHERE oi.order_id = 123;

# Verify stock was reduced
SELECT name, stock FROM products WHERE id = 5;
```

### 3. View in React Client
```bash
# Visit http://localhost:5173/manajemen-pesanan
# Verify order appears in list
# Click on order to see details
# Update status through modal
```

## Troubleshooting

### Issue: Order saved locally but not in backend API

**Causes**:
- Backend API server not running
- Network error calling localhost:5001
- Missing JWT token

**Solution**:
1. Verify both backend and frontend servers running
2. Check logs on both servers
3. Verify farm-ecommerce has valid session (req.session.userToken)

### Issue: Product stock shows as zero after order

**Cause**: Backend API transaction rolled back or not committed

**Solution**:
1. Check backend logs for transaction errors  
2. Verify products table stock column
3. Re-run migration if corruption suspected

### Issue: Order not appearing in React client

**Causes**:
- Backend API not returning orders
- Wrong API URL in client
- Authentication issue

**Solution**:
1. Verify backend API is running on port 5001
2. Check client API_URL configuration
3. Manually test API: `curl http://localhost:5001/api/orders`

## Future Enhancements

- [ ] Real-time order status updates with WebSocket
- [ ] Email notifications on order status change
- [ ] Receipt/Invoice PDF generation
- [ ] Order refunds and cancellations
- [ ] Multi-currency support
- [ ] Advanced order analytics
