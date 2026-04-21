# API Alamat Pengiriman (Shipping Addresses API)

## Overview
API lengkap untuk mengelola alamat pengiriman pengguna. Semua endpoint memerlukan autentikasi JWT token.

## Base URL
```
http://localhost:5001/api/addresses
```

## Authentication
Semua request harus menyertakan header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### 1. GET /api/addresses
Mengambil semua alamat pengiriman untuk user yang login

**Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/addresses
```

**Response (200 OK):**
```json
{
  "success": true,
  "addresses": [
    {
      "id": 1,
      "user_id": 5,
      "label": "Rumah",
      "name": "John Doe",
      "phone": "08123456789",
      "address": "Jl. Raya Manud Jaya No. 123",
      "city": "Bekasi",
      "postal_code": "17510",
      "is_primary": true,
      "created_at": "2024-04-22T10:00:00Z",
      "updated_at": "2024-04-22T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

### 2. GET /api/addresses/:id
Mengambil alamat spesifik berdasarkan ID

**Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/addresses/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "address": {
    "id": 1,
    "user_id": 5,
    "label": "Rumah",
    "name": "John Doe",
    "phone": "08123456789",
    "address": "Jl. Raya Manud Jaya No. 123",
    "city": "Bekasi",
    "postal_code": "17510",
    "is_primary": true,
    "created_at": "2024-04-22T10:00:00Z",
    "updated_at": "2024-04-22T10:00:00Z"
  }
}
```

**Error (404):**
```json
{
  "error": "Address not found"
}
```

---

### 3. POST /api/addresses
Membuat alamat baru

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Kantor",
    "name": "John Doe",
    "phone": "08123456789",
    "address": "Jl. Merdeka No. 456",
    "city": "Jakarta Pusat",
    "postal_code": "10110",
    "is_primary": false
  }' \
  http://localhost:5001/api/addresses
```

**Required Fields:**
- `name` (string) - Nama penerima
- `phone` (string) - Nomor telepon
- `address` (string) - Alamat lengkap

**Optional Fields:**
- `label` (string) - Label alamat (contoh: Rumah, Kantor)
- `city` (string) - Kota/Kabupaten
- `postal_code` (string) - Kode pos
- `is_primary` (boolean) - Jadikan alamat utama (default: false)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Address created successfully",
  "address": {
    "id": 2,
    "user_id": 5,
    "label": "Kantor",
    "name": "John Doe",
    "phone": "08123456789",
    "address": "Jl. Merdeka No. 456",
    "city": "Jakarta Pusat",
    "postal_code": "10110",
    "is_primary": false,
    "created_at": "2024-04-22T11:00:00Z",
    "updated_at": "2024-04-22T11:00:00Z"
  }
}
```

**Error (400):**
```json
{
  "error": "name, phone, and address are required"
}
```

---

### 4. PUT /api/addresses/:id
Update alamat yang sudah ada

**Request:**
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Rumah Baru",
    "name": "John Doe",
    "phone": "08987654321",
    "address": "Jl. Sudirman No. 789",
    "city": "Jakarta Selatan",
    "postal_code": "12210",
    "is_primary": true
  }' \
  http://localhost:5001/api/addresses/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "address": {
    "id": 1,
    "user_id": 5,
    "label": "Rumah Baru",
    "name": "John Doe",
    "phone": "08987654321",
    "address": "Jl. Sudirman No. 789",
    "city": "Jakarta Selatan",
    "postal_code": "12210",
    "is_primary": true,
    "created_at": "2024-04-22T10:00:00Z",
    "updated_at": "2024-04-22T12:30:00Z"
  }
}
```

**Note:** Jika `is_primary` diset ke `true`, semua alamat lain untuk user akan otomatis menjadi `false`

---

### 5. DELETE /api/addresses/:id
Menghapus alamat

**Request:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/addresses/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

**Error (404):**
```json
{
  "error": "Address not found"
}
```

---

### 6. PUT /api/addresses/:id/set-primary
Set alamat tertentu sebagai alamat utama

**Request:**
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/addresses/2/set-primary
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Address set as primary",
  "address": {
    "id": 2,
    "user_id": 5,
    "label": "Kantor",
    "name": "John Doe",
    "phone": "08123456789",
    "address": "Jl. Merdeka No. 456",
    "city": "Jakarta Pusat",
    "postal_code": "10110",
    "is_primary": true,
    "created_at": "2024-04-22T11:00:00Z",
    "updated_at": "2024-04-22T12:45:00Z"
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Address not found"
}
```

### 400 Bad Request
```json
{
  "error": "name, phone, and address are required"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create/update/delete address"
}
```

---

## Database Schema

```sql
CREATE TABLE addresses (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label         VARCHAR(100),
    name          VARCHAR(255) NOT NULL,
    phone         VARCHAR(20) NOT NULL,
    address       TEXT NOT NULL,
    city          VARCHAR(100),
    postal_code   VARCHAR(10),
    is_primary    BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_addresses_primary_per_user 
    ON addresses (user_id) 
    WHERE is_primary = true;
```

---

## Frontend Integration Example

### HTML/EJS
```html
<!-- Address form di views/alamat-pengiriman.ejs -->
<form onsubmit="saveAddress(event)">
    <input type="text" name="label" placeholder="Label (Rumah, Kantor, dll)">
    <input type="text" name="name" placeholder="Nama Penerima" required>
    <input type="tel" name="phone" placeholder="Nomor Telepon" required>
    <textarea name="address" placeholder="Alamat Lengkap" required></textarea>
    <input type="text" name="city" placeholder="Kota/Kabupaten">
    <input type="text" name="postal_code" placeholder="Kode Pos">
    <input type="checkbox" name="is_primary"> Alamat Utama
    <button type="submit">Simpan</button>
</form>
```

### JavaScript
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
const authToken = localStorage.getItem('authToken');

// Load addresses
async function loadAddresses() {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await response.json();
    console.log(data.addresses);
}

// Save address (create or update)
async function saveAddress(formData) {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
    });
    const data = await response.json();
    console.log(data);
}
```

---

## Testing dengan cURL

```bash
# Login dan dapatkan token
TOKEN=$(curl -s -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' | jq -r '.token')

# Get semua addresses
curl -H "Authorization: Bearer $TOKEN" http://localhost:5001/api/addresses

# Create address
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label":"Rumah",
    "name":"John Doe",
    "phone":"08123456789",
    "address":"Jl. Raya No. 123",
    "city":"Bekasi",
    "postal_code":"17510",
    "is_primary":true
  }' \
  http://localhost:5001/api/addresses

# Update address
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","phone":"08987654321"}' \
  http://localhost:5001/api/addresses/1

# Delete address
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/addresses/1

# Set as primary
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/addresses/2/set-primary
```

---

## Notes

1. **One Primary Address Per User**: Database constraint memastikan hanya satu alamat yang bisa menjadi primary per user

2. **Data Validation**: 
   - Nama, nomor telepon, dan alamat adalah wajib
   - Phone format tidak divalidasi ketat (bisa disesuaikan)

3. **Authorization**: User hanya bisa akses, edit, dan delete alamat mereka sendiri

4. **Cascade Delete**: Jika user dihapus, semua alamat mereka juga akan dihapus

5. **Timestamps**: Setiap alamat menyimpan `created_at` dan `updated_at` untuk audit trail
