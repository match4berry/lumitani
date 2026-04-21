# Authentication API Setup Guide

## 📦 Required Packages

Install these packages first:

```bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

## 🔧 Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=24h
```

## 🗄️ Database Migration

Run the migration to add password field to users table:

```bash
# The migration file 009_add_password_to_users.sql will add:
# - password VARCHAR(255)
# - last_login TIMESTAMPTZ
```

## 📚 API Endpoints

### **POST** `/api/users/register`
Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "081234567890",
  "address": "Jakarta, Indonesia"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "081234567890",
    "address": "Jakarta, Indonesia",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **POST** `/api/users/login`
Login with email and password

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

### **POST** `/api/users/logout`
Logout user (requires authentication token)

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### **GET** `/api/users/me`
Get current user profile (requires authentication token)

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "address": "Jakarta, Indonesia",
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-15T15:45:00Z"
}
```

---

### **POST** `/api/users/change-password`
Change user password (requires authentication token)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🔐 Using the Token

After login/register, use the token in subsequent requests:

```bash
# Example: Get current user
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/users/me
```

---

## 🛡️ Protecting Routes with Auth Middleware

To protect a route, import and use the `verifyToken` middleware:

```typescript
import { verifyToken, AuthRequest } from "../middleware/auth";

// Protected route
router.get("/protected-route", verifyToken, async (req: AuthRequest, res: Response) => {
  console.log("User ID:", req.userId);
  console.log("User Email:", req.userEmail);
  console.log("User Name:", req.userName);
  
  res.json({ message: "Access granted", userId: req.userId });
});
```

---

## ✅ Testing Checklist

- [ ] Install `bcrypt` and `jsonwebtoken` packages
- [ ] Add `JWT_SECRET` to .env file
- [ ] Run migration 009_add_password_to_users.sql
- [ ] Restart server
- [ ] Test POST /api/users/register with valid data
- [ ] Test POST /api/users/login with correct credentials
- [ ] Test POST /api/users/login with wrong password (should fail)
- [ ] Test GET /api/users/me with token (should return user profile)
- [ ] Test GET /api/users/me without token (should return 401)
- [ ] Test POST /api/users/logout (requires token)
- [ ] Test POST /api/users/change-password (requires token)
- [ ] Verify last_login is updated after login

---

## 🐛 Common Issues

**Issue: "Cannot find module 'bcrypt'"**
- Solution: Run `npm install bcrypt @types/bcrypt`

**Issue: "Cannot find module 'jsonwebtoken'"**
- Solution: Run `npm install jsonwebtoken @types/jsonwebtoken`

**Issue: "JWT_SECRET is not defined"**
- Solution: Add `JWT_SECRET` to your .env file

**Issue: "Table users has no column named password"**
- Solution: Run the migration file 009_add_password_to_users.sql

**Issue: "Invalid token" on protected routes**
- Solution: Make sure to send Authorization header: `Authorization: Bearer {token}`

---

## 📝 Token Details

- **Format**: JWT (JSON Web Token)
- **Expiry**: 24 hours
- **Contains**: User ID, Email, Name
- **Signed with**: JWT_SECRET environment variable

Token expires after 24 hours and a new login is required.
