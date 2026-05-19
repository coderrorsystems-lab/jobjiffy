# Backend Route Documentation

---

## New API Structure

```
/api/auth/              → Authentication (register, login, refresh-token)
/api/users/             → User business logic (profile, password, bookings, reviews)
/api/professionals/     → Professional business logic (profile, services, wallet, bookings)
/api/admin/            → Admin business logic (approve, users, dashboard)
/api/categories/       → Category & services (browse by category, get services with professionals)
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
  "otp": "6-digit string (REQUIRED)",
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

### 2. POST /auth/login — Login (single endpoint for all roles)

**Middleware:** `validate(loginSchema)`

**req.body:**
```json
{
  "email": "valid email string",
  "password": "string",
  "role": "user | professional | admin"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "role": "user|professional|admin",
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token"
}
```

**Notes:**
- Client must send the role along with credentials
- Professional can only login if status is "approved"
- Admin uses hardcoded credentials from .env

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
  "otp": "6-digit string (REQUIRED)",
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
      "categoryId": "number (101-109)",
      "serviceName": "string",
      "description": "string (optional)",
      "price": "number (positive)"
    }
  ],
  "categories": ["number (101-109)", "number (101-109)"],
  "experience": "number (optional)",
  "kycDocuments": {
    "collegeId": "string (optional)"
  },
  "accountNumber": "string (optional)",
  "accountHolderName": "string (optional)",
  "ifscCode": "string (optional)",
  "upiId": "string (optional)"
}
```

**Notes:**
- `categoryId` in services must be between 101-109
- `categories` array must contain at least one category ID (101-109)
- Services are automatically added to both Professional model and Category model

**Response:**
```json
{
  "message": "Professional registered successfully. Pending admin approval.",
  "professional": { ... }
}
```

---

### 4. POST /auth/send-otp — Send OTP for email verification

**Middleware:** `validate(sendOtpSchema)`

**req.body:**
```json
{
  "email": "valid email string"
}
```

**Response:**
```json
{ "message": "OTP sent to your email" }
```

**Notes:**
- OTP expires in 15 minutes
- Use this before registration to get OTP
- Then include OTP in registration request

---

### 5. POST /auth/refresh-token — Refresh expired access token

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
  "categoryId": "number (101-109)",
  "serviceName": "string",
  "description": "string (optional)",
  "price": "number (positive)"
}
```

**Notes:**
- Service is added to both Professional model and Category model
- Service will reference the Category by `categoryId`

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

## CATEGORIES MODULE (`/api/categories/`)

Public routes (no authentication required).

### 1. GET /categories — Get all categories

**Response:**
```json
{
  "categories": [
    {
      "_id": "mongodb_object_id",
      "id": 101,
      "name": "Logo Design",
      "description": "Logo and brand identity design services",
      "isActive": true
    },
    ...
  ]
}
```

---

### 2. GET /categories/:id — Get category by ID

**Params:** `id` (number, 101-109)

**Response:**
```json
{
  "category": {
    "_id": "mongodb_object_id",
    "id": 101,
    "name": "Logo Design",
    "description": "...",
    "services": [],
    "isActive": true
  }
}
```

**Errors:**
- `404` if category not found

---

### 3. GET /categories/:id/services — Get all services in a category

**Params:** `id` (number, 101-109)

**Response:**
```json
{
  "services": [
    {
      "_id": "mongodb_object_id",
      "serviceName": "Basic Logo",
      "description": "...",
      "price": 500,
      "professionalId": "mongodb_object_id"
    },
    ...
  ]
}
```

---

### 4. GET /categories/:id/services-with-professionals — Get paginated services with professional details

**Params:** `id` (number, 101-109)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 20 | Items per page (max 50) |
| `sort` | string | `price_asc` | Sort order: `price_asc`, `price_desc`, `rating`, `newest` |
| `available` | boolean | true | Filter by available professionals |

**Example:** `GET /api/categories/101/services-with-professionals?page=1&limit=20&sort=price_asc`

**Response:**
```json
{
  "categoryId": 101,
  "categoryName": "Logo Design",
  "totalServices": 45,
  "totalPages": 3,
  "currentPage": 1,
  "perPage": 20,
  "services": [
    {
      "serviceId": "mongodb_object_id",
      "serviceName": "Basic Logo Design",
      "description": "Professional logo with 3 revisions",
      "price": 500,
      "professional": {
        "id": "mongodb_object_id",
        "name": "John Doe",
        "rating": 4.5
      }
    },
    ...
  ]
}
```

**Notes:**
- Only returns services from professionals with `status: 'approved'`
- By default, only returns services from `isAvailable: true` professionals
- Results are cached for 5 minutes
- Sort options:
  - `price_asc` - Price low to high
  - `price_desc` - Price high to low
  - `rating` - Professional rating (highest first)
  - `newest` - Most recently added services first

**Errors:**
- `400` if invalid category ID (must be 101-109)
- `400` if invalid query parameters
- `404` if category not found

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