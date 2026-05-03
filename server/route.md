# Backend Route Documentation

All routes are prefixed with `/api/auth`

---

## 1. POST /register/user — Register a new user

**What it does:** Creates a new regular user account

**Middleware:** `validate(userRegisterSchema)` — checks the request body

**req.body:**
```json
{
  "name": "string (2-100 chars)",
  "email": "valid email string",
  "password": "string (min 6 chars)",
  "phone": "E.164 format like +919999999999",
  "address": {
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

## 2. POST /register/professional — Register a new professional

**What it does:** Creates a professional account that requires admin approval before login

**Middleware:** `validate(professionalRegisterSchema)`

**req.body:**
```json
{
  "name": "string (2-100 chars)",
  "email": "valid email string",
  "password": "string (min 6 chars)",
  "phone": "E.164 format like +919999999999",
  "address": { ... },
  "professionalDetails": {
    "category": "cleaning | beauty | repair | appliance | personalcare | other",
    "services": [
      {
        "name": "string",
        "description": "string",
        "price": "number (positive)"
      }
    ],
    "experience": "number (years)",
    "bio": "string (max 500 chars)",
    "serviceArea": {
      "city": "string",
      "radius": "number (positive)"
    },
    "kycDocuments": {
      "aadhar": "string",
      "pan": "string",
      "addressProof": "string"
    },
    "bankDetails": {
      "accountNumber": "string",
      "ifsc": "string",
      "accountHolderName": "string",
      "upiId": "string (optional)"
    }
  }
}
```

**Response:**
```json
{
  "message": "Professional registered successfully. Pending admin approval.",
  "user": {
    ...,
    "status": "pending"
  }
}
```

---

## 3. POST /login — Email/password login

**What it does:** Logs in a user/professional with email and password

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

**Notes:** Professionals can only login if their status is "approved"

---

## 4. POST /refresh-token — Refresh expired access token

**What it does:** Issues a new access token using a valid refresh token

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

## 5. POST /logout — Logout current user

**What it does:** Clears the refresh token from the database

**Middleware:** `authenticate` — requires valid JWT access token

**Header:** `Authorization: Bearer <accessToken>`

**req.body:** None

**Response:**
```json
{
  "message": "Logout successful"
}
```

---

## 6. POST /admin/login — Admin login

**What it does:** Logs in the hardcoded admin (email + password from .env)

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
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token"
}
```

**Notes:** If admin doesn't exist in DB, creates one on first login

---

## 7. GET /profile — Get current user profile

**What it does:** Returns the logged-in user's full profile

**Middleware:** `authenticate`

**Header:** `Authorization: Bearer <accessToken>`

**Response:**
```json
{
    "user": {
        "address": {
            "street": "MG Road",
            "city": "Indore",
            "state": "Madhya Pradesh",
            "pincode": "452001",
            "country": "India"
        },
        "professionalDetails": {
            "category": null,
            "status": "pending",
            "isAvailable": false,
            "rating": 0,
            "totalReviews": 0,
            "walletBalance": 0,
            "totalEarnings": 0,
            "services": []
        },
        "_id": "69f214118f1493e58591f203",
        "name": "Jatin Patidar",
        "email": "jatinpatidar@example.com",
        "phone": "+919876543210",
        "role": "user",
        "isPhoneVerified": false,
        "isEmailVerified": false,
        "isActive": true,
        "profilePhoto": null,
        "lastLogin": "2026-05-03T05:42:40.887Z",
        "createdAt": "2026-04-29T14:22:09.571Z",
        "updatedAt": "2026-05-03T05:42:41.126Z",
        "__v": 0
    }
}
```

---

## 8. PUT /profile — Update user profile

**What it does:** Updates name, address, or profile photo of the logged-in user

**Middleware:** `authenticate`

**req.body:**
```json
{
  "name": "string (optional)",
  "address": {
    "street": "string (optional)",
    "city": "string (optional)",
    "state": "string (optional)",
    "pincode": "string (optional)"
  },
  "profilePhoto": "URL string (optional)"
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

## 9. POST /change-password — Change password

**What it does:** Changes the logged-in user's password after verifying current password

**Middleware:** `authenticate`

**req.body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 6 chars)"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

---

## Middleware Reference

| Middleware | What it does |
|------------|---------------|
| `validate(schema)` | Checks req.body against a Zod schema. Returns 400 if invalid. |
| `authenticate` | Reads JWT from `Authorization: Bearer <token>` header, verifies it, loads user into `req.user`. Returns 401 if missing/invalid/expired. |
| `authorize(roles)` | (Available but not used in auth routes) — restricts access to specific roles. |
| `optionalAuth` | (Available but not used) — same as authenticate but continues even if no token. |

---

## Role-Based Access

| Role | Can Access |
|------|------------|
| `user` | /register/user, /login, /refresh-token, /logout, /profile, /change-password |
| `professional` | Same as user + /register/professional (before approval) |
| `admin` | All user endpoints + /admin/login |

---

## Token Info

- **Access Token:** 15 minutes expiry (configurable via JWT_ACCESS_EXPIRE in .env)
- **Refresh Token:** 7 days expiry (configurable via JWT_REFRESH_EXPIRE in .env)
- **Store refresh token** in httpOnly cookie or secure storage on client
- **Use refresh token** at `/api/auth/refresh-token` to get new access token when expired