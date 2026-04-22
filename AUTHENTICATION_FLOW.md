# Authentication Flow - Farm eCommerce & Backend API

## Overview

Farm-eCommerce menggunakan 2-tier authentication:
1. **Server-side Session** di farm-ecommerce (port 8080)
2. **JWT Token** dari backend API server (port 5001)

Ketika user login, session menyimpan JWT token yang dapat digunakan untuk API calls.

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   User Login Flow                               │
└─────────────────────────────────────────────────────────────────┘

1. User Submit Form
   ├─ POST /login (farm-ecommerce)
   │
2. Server Call External API
   ├─ POST http://localhost:5001/api/users/login
   │
3. Backend Server Returns JWT Token
   ├─ { token, user: {...} }
   │
4. Farm-eCommerce Save to Session
   ├─ req.session.userToken = token
   ├─ req.session.userId = user.id
   ├─ req.session.userEmail = user.email
   ├─ req.session.userName = user.name
   │
5. Session Cookie Sent to Browser
   └─ Set-Cookie: connect.sid=...
```

## Key Endpoints

### 1. Login (Farm-eCommerce)
**POST /login**
```
Form Data:
  - email
  - password

Response:
  - Redirect to /home
  - Set-Cookie: connect.sid (session)
```

### 2. Get Current User Token (Farm-eCommerce)
**GET /api/users/me**

Returns the JWT token from session for authenticated user.

```bash
curl http://localhost:8080/api/users/me
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 5,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error (401):**
```json
{
  "error": "Not logged in"
}
```

### 3. Use Token for Backend API Calls

Once you have the token from `/api/users/me`, use it for all backend API calls:

```javascript
// Get token from session
const response = await fetch('http://localhost:8080/api/users/me');
const data = await response.json();
const token = data.token;

// Use token for backend API
const addressResponse = await fetch('http://localhost:5001/api/addresses', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Files Structure

```
farm-ecommerce/
├── src/
│   └── server.js              # Express server, handles sessions
│       ├── POST /login        # Login route
│       ├── GET /api/users/me  # NEW: Get token from session
│       └── GET /logout        # Logout route
│
└── views/
    ├── login.ejs              # Login page
    ├── alamat-pengiriman.ejs  # Address mgmt page
    │   └── Script: Fetch token from /api/users/me first
    └── [other pages]

server/
└── src/
    ├── routes/
    │   ├── users.ts           # User authentication API
    │   ├── addresses.ts       # Address CRUD API (requires JWT)
    │   └── [other routes]
    │
    └── middleware/
        └── auth.ts            # JWT verification middleware
```

## Session Storage

When user logs in, server stores:
```javascript
req.session.userId = user.id              // User ID
req.session.userEmail = user.email        // Email
req.session.userName = user.name          // Name
req.session.userToken = data.token        // JWT Token
```

Session is stored:
- **Server-side**: Memory (can use Redis in production)
- **Client-side**: Encrypted cookie `connect.sid`

## Frontend Implementation Pattern

### For Pages needing Backend API:

```html
<!-- views/alamat-pengiriman.ejs -->
<script>
const API_BASE_URL = 'http://localhost:5001/api';
let authToken = null;

// Step 1: Get token from session
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/users/me')
        .then(r => r.json())
        .then(data => {
            authToken = data.token;
            // Now can use token for API calls
            loadAddresses();
        })
        .catch(err => window.location.href = '/login');
});

// Step 2: Use token in API calls
async function loadAddresses() {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });
    const data = await response.json();
    // Process data...
}
</script>
```

## Security Considerations

1. **Session Security**
   - Session cookie is HttpOnly (not accessible from JavaScript)
   - Secure flag set when using HTTPS
   - SameSite protection enabled

2. **Token Security**
   - JWT token expires after 24 hours
   - Token is stored server-side in session, not exposed to localStorage
   - Each browser session gets its own session ID

3. **CORS**
   - Backend API (port 5001) allows requests from port 8080
   - Authorization header passed with all API requests

4. **User Data Isolation**
   - Each API endpoint checks if resource belongs to authenticated user
   - User cannot access other users' data

## Login/Logout Flow

### Login
```
1. User fills login form
2. POST /login with email + password
3. Server validates with backend API
4. Server saves token to req.session
5. Redirect to /home
```

### Logout
```
1. GET /logout
2. Server destroys session (req.session.destroy)
3. Session cookie becomes invalid
4. Redirect to home
```

## Testing

### Login
```bash
# 1. Open browser, go to http://localhost:8080/login
# 2. Enter credentials
# 3. Should redirect to /home with session active
```

### Get Token
```bash
# After login, try getting token
curl http://localhost:8080/api/users/me

# Should respond with token (requires valid session cookie)
```

### Use Token for Backend API
```bash
# Get token
TOKEN=$(curl http://localhost:8080/api/users/me | jq -r '.token')

# Use token for backend API
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/addresses
```

## Troubleshooting

### Issue: "Silakan login terlebih dahulu" appears after login

**Cause:**
- Session not properly saved
- Token is null
- `/api/users/me` not returning token

**Solution:**
1. Check browser cookies - should have `connect.sid`
2. Check server logs - see if session is created
3. Ensure farm-ecommerce server is running
4. Clear cookies and login again

### Issue: Backend API returns 401 Unauthorized

**Cause:**
- Token is expired
- Token is malformed
- Authorization header not sent

**Solution:**
1. Get fresh token from `/api/users/me`
2. Verify token format: `Bearer <token>`
3. Check backend server logs

### Issue: Cannot access /alamat-pengiriman page

**Cause:**
- Session not found (not logged in)
- Session expired

**Solution:**
1. Login first via /login
2. Session should persist for 24 hours
3. If expired, login again

## Environment Variables

**Farm-eCommerce (.env)**
```
SESSION_SECRET=your-secret-key
PORT=8080
```

**Backend Server (.env)**
```
JWT_SECRET=your-jwt-secret
PORT=5001
DATABASE_URL=postgresql://...
```

## Next Steps

- Implement token refresh mechanism (refresh token)
- Add more user roles (admin, farmer)
- Implement 2FA for additional security
- Switch to Redis for session storage in production
