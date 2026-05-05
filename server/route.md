# Backend Route Documentation

---

## New API Structure

```
/api/auth/              → Authentication (register, login, refresh-token)
/api/users/             → User business logic (profile, password, bookings, reviews)
/api/professionals/     → Professional business logic (profile, services, wallet, bookings)
/api/admin/            → Admin business logic (approve, users, dashboard)
```

---

## AUTH MODULE (`/api/auth/`)

### 1. POST /auth/user/register — Register a new user

**Middleware:** `validate(userRegisterSchema)`

**req.body:**
```json
{
  "name": "string (2-100 chars)",
  "email": "valid email string",
  "password": "string (min 6 chars)",
  "phone": "E.164 format like +919999999999",
  "img": "URL string (optional)",
  "bio": "string (max 500, optional)",
  "location": {
    "street": "string (optional)",
    "city": "string (optional)",
    "state": "string (optional)",
    "pincode": "string (optional)"
  }
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token"
}
```

---

### 2. POST /auth/user/login — Login as user

**Middleware:** `validate(loginSchema)`

**req.body:**
```json
{
  "email": "valid email string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token"
}
```

---

### 3. POST /auth/professional/register — Register a new professional

**Middleware:** `validate(professionalRegisterSchema)`

**req.body:**
```json
{
  "fullname": "string (2-100 chars)",
  "email": "valid email string",
  "password": "string (min 6 chars)",
  "phone": "E.164 format like +919999999999",
  "streetAddress": "string (optional)",
  "city": "string (required)",
  "state": "string (optional)",
  "zipCode": "string (optional)",
  "collegeName": "string (optional)",
  "department": "string (optional)",
  "yearOfGraduation": "number (optional)",
  "collegeEmail": "string (optional)",
  "collegeIdPhoto": "URL string (optional)",
  "bio": "string (max 500, optional)",
  "services": [
    {
      "category": "cleaning | beauty | repair | appliance | personalcare | other",
      "serviceName": "string",
      "desc": "string (optional)",
      "price": "number (positive)"
    }
  ],
  "category": "cleaning | beauty | repair | appliance | personalcare | other",
  "experience": "number (optional)",
  "kycDocuments": {
    "aadhar": "string (required)",
    "pan": "string (required)"
  },
  "accountNumber": "string (optional)",
  "accountHolderName": "string (optional)",
  "ifscCode": "string (optional)",
  "upiId": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Professional registered successfully. Pending admin approval.",
  "professional": { ... }
}
```

---

### 4. POST /auth/professional/login — Login as professional

**Middleware:** `validate(loginSchema)`

**req.body:**
```json
{
  "email": "valid email string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "professional": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token"
}
```

**Notes:** Professionals can only login if their status is "approved"

---

### 5. POST /auth/admin/login — Admin login

**Middleware:** `validate(loginSchema)`

**req.body:**
```json
{
  "email": "admin@jobjiffy.com",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Admin login successful",
  "admin": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token"
}
```

---

### 6. POST /auth/refresh-token — Refresh expired access token

**Middleware:** `validate(refreshTokenSchema)`

**req.body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token"
}
```

---

## USERS MODULE (`/api/users/`)

All routes use `authenticate` middleware.

### 1. GET /users/profile — Get user profile

**Response:**
```json
{ "user": { ... } }
```

---

### 2. PUT /users/profile — Update user profile

**Middleware:** `validate(userUpdateProfileSchema)`

**req.body:**
```json
{
  "name": "string (optional)",
  "bio": "string (optional)",
  "img": "URL string (optional)",
  "location": { ... }
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### 3. POST /users/change-password — Change password

**Middleware:** `validate(userChangePasswordSchema)`

**req.body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 6 chars)"
}
```

**Response:**
```json
{ "message": "Password changed successfully" }
```

---

### 4. GET /users/bookings — Get user bookings

**Response:**
```json
{ "bookings": [] }
```

---

### 5. GET /users/reviews — Get user reviews

**Response:**
```json
{ "reviews": [] }
```

---

### 6. POST /users/logout — Logout user

**Response:**
```json
{ "message": "Logout successful" }
```

---

## PROFESSIONALS MODULE (`/api/professionals/`)

All routes use `authenticate` middleware.

### 1. GET /professionals/profile — Get professional profile

**Response:**
```json
{ "professional": { ... } }
```

---

### 2. PUT /professionals/profile — Update professional profile

**Middleware:** `validate(professionalUpdateProfileSchema)`

**req.body:** (all fields optional)
```json
{
  "fullname": "string",
  "bio": "string",
  "streetAddress": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "collegeName": "string",
  "department": "string",
  "yearOfGraduation": "number",
  "collegeEmail": "string",
  "collegeIdPhoto": "URL string",
  "accountNumber": "string",
  "accountHolderName": "string",
  "ifscCode": "string",
  "upiId": "string"
}
```

---

### 3. POST /professionals/change-password — Change password

**Middleware:** `validate(professionalChangePasswordSchema)`

**req.body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 6 chars)"
}
```

---

### 4. GET /professionals/services — Get all services

**Response:**
```json
{ "services": [...] }
```

---

### 5. POST /professionals/services — Add service

**Middleware:** `validate(addServiceSchema)`

**req.body:**
```json
{
  "category": "cleaning | beauty | repair | appliance | personalcare | other",
  "serviceName": "string",
  "desc": "string (optional)",
  "price": "number (positive)"
}
```

---

### 6. PUT /professionals/services/:id — Update service

**Middleware:** `validate(updateServiceSchema)`

**req.body:** (partial update)
```json
{
  "serviceName": "string",
  "desc": "string",
  "price": "number"
}
```

---

### 7. DELETE /professionals/services/:id — Delete service

---

### 8. POST /professionals/availability — Toggle availability

**Response:**
```json
{
  "message": "Availability enabled/disabled",
  "isAvailable": true/false
}
```

---

### 9. GET /professionals/wallet — Get wallet info

**Response:**
```json
{
  "wallet": {
    "walletBalance": 0,
    "totalEarnings": 0,
    "rating": 0,
    "totalReviews": 0
  }
}
```

---

### 10. GET /professionals/bookings — Get assigned bookings

**Response:**
```json
{ "bookings": [] }
```

---

### 11. POST /professionals/logout — Logout professional

**Response:**
```json
{ "message": "Logout successful" }
```

---

## ADMIN MODULE (`/api/admin/`)

All routes use `authenticate` + `authorize('admin')` middleware.

### 1. GET /admin/profile — Get admin profile

**Response:**
```json
{ "admin": { ... } }
```

---

### 2. GET /admin/professionals — List all professionals

**Query params:** `?status=pending|approved|rejected`

**Response:**
```json
{ "professionals": [...] }
```

---

### 3. GET /admin/professionals/:id — Get professional details

---

### 4. PUT /admin/professionals/:id/approve — Approve professional

**Response:**
```json
{
  "message": "Professional approved successfully",
  "professional": { ... }
}
```

---

### 5. PUT /admin/professionals/:id/reject — Reject professional

**Response:**
```json
{
  "message": "Professional rejected",
  "professional": { ... }
}
```

---

### 6. GET /admin/users — List all users

**Query params:** `?isActive=true|false`

**Response:**
```json
{ "users": [...] }
```

---

### 7. GET /admin/users/:id — Get user details

---

### 8. PUT /admin/users/:id/block — Block/unblock user

**Middleware:** `validate(blockUserSchema)`

**req.body:**
```json
{ "isActive": false }
```

**Response:**
```json
{
  "message": "User blocked/unblocked",
  "user": { ... }
}
```

---

### 9. GET /admin/dashboard — Get dashboard stats

**Response:**
```json
{
  "totalUsers": 0,
  "totalProfessionals": 0,
  "approvedProfessionals": 0,
  "pendingProfessionals": 0,
  "totalBookings": 0,
  "totalRevenue": 0
}
```

---

### 10. POST /admin/logout — Logout admin

**Response:**
```json
{ "message": "Logout successful" }
```

---

## Middleware Reference

| Middleware | What it does |
|------------|---------------|
| `validate(schema)` | Checks req.body against a Zod schema. Returns 400 if invalid. |
| `authenticate` | Reads JWT from `Authorization: Bearer <token>` header, verifies it, loads user into `req.user`. Returns 401 if missing/invalid/expired. |
| `authorize(roles)` | Restricts access to specific roles (e.g., 'admin'). Returns 403 if not authorized. |

---

## Token Info

- **Access Token:** 15 minutes expiry (configurable via JWT_ACCESS_EXPIRE in .env)
- **Refresh Token:** 7 days expiry (configurable via JWT_REFRESH_EXPIRE in .env)
- **JWT Payload includes:** `userId`, `email`, `role` (user/professional/admin), `model` (User/Professional/Admin)
- **Store refresh token** in httpOnly cookie or secure storage on client
- **Use refresh token** at `/api/auth/refresh-token` to get new access token when expired