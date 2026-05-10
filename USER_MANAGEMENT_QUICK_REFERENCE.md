# User Management - Quick Reference

## Files Created/Modified

### Backend (Server)
| File | Changes | Lines |
|------|---------|-------|
| `adminController.js` | Added deleteUser, resetUserPassword methods | +25 |
| `adminService.js` | Added deleteUser, resetUserPassword methods | +15 |
| `adminRoutes.js` | Added 3 user management routes | +3 |

### Frontend (Client)
| File | Type | Lines |
|------|------|-------|
| `AdminUsers.jsx` | ✨ NEW | 125 |
| `AdminUserDetail.jsx` | ✨ NEW | 180 |
| `AdminLayout.jsx` | ✨ NEW | 60 |
| `adminAPI.js` | Modified | +30 |
| `AdminDashboard.jsx` | Modified | +5 |
| `App.jsx` | Modified | +15 |

**Total New Code:** ~365 lines of well-structured React/JavaScript

---

## API Endpoints Reference

### Users Management
```
GET  /api/admin/users              - List all users
GET  /api/admin/users/:id          - Get user details
PUT  /api/admin/users/:id/block    - Block/unblock user
DELETE /api/admin/users/:id        - Delete user
POST /api/admin/users/:id/reset-password - Reset password
```

### Request/Response Examples

**Get Users:**
```bash
GET /api/admin/users
Authorization: Bearer <token>

Response:
{
  "users": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9999999999",
      "isActive": true,
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Block User:**
```bash
PUT /api/admin/users/507f1f77bcf86cd799439011/block
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}

Response:
{
  "message": "User blocked",
  "user": { ... }
}
```

**Delete User:**
```bash
DELETE /api/admin/users/507f1f77bcf86cd799439011
Authorization: Bearer <token>

Response:
{
  "message": "User deleted successfully",
  "user": { ... }
}
```

---

## Routes Mapping

```
Frontend Routes:
├── /admin                  → AdminDashboard (+ AdminLayout)
├── /admin/professionals   → AdminProfessionals (+ AdminLayout)
├── /admin/professionals/:id → AdminProfessionalDetail (+ AdminLayout)
├── /admin/users           → AdminUsers (+ AdminLayout) ✨ NEW
└── /admin/users/:id       → AdminUserDetail (+ AdminLayout) ✨ NEW

Backend Routes:
└── /api/admin
    ├── /users             → GET
    ├── /users/:id         → GET
    ├── /users/:id/block   → PUT ✨ NEW
    ├── /users/:id         → DELETE ✨ NEW
    └── /users/:id/reset-password → POST ✨ NEW
```

---

## Component Tree

```
App.jsx
├── ProtectedRoute (role: admin)
│   ├── AdminLayout
│   │   ├── Sidebar Navigation
│   │   └── Main Content
│   │       ├── AdminDashboard
│   │       ├── AdminProfessionals
│   │       ├── AdminProfessionalDetail
│   │       ├── AdminUsers ✨ NEW
│   │       └── AdminUserDetail ✨ NEW
```

---

## State Management Pattern

### AdminUsers.jsx
```javascript
const [users, setUsers] = useState([])        // User list
const [loading, setLoading] = useState(false) // Loading state
const [error, setError] = useState('')        // Error message
```

**Actions:**
- Block/Unblock: Update isActive property
- Delete: Filter out deleted user
- Load: Fetch all users

### AdminUserDetail.jsx
```javascript
const [user, setUser] = useState(null)           // User data
const [loading, setLoading] = useState(false)   // Initial load
const [actionLoading, setActionLoading] = useState(false) // Action state
const [error, setError] = useState('')          // Error messages
```

---

## Key Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| View Users | ✅ | Table with 6 columns |
| View Details | ✅ | Full profile page |
| Block User | ✅ | Toggle isActive |
| Unblock User | ✅ | Toggle isActive |
| Delete User | ✅ | Permanent removal |
| Reset Password | ✅ | Email trigger |
| Error Handling | ✅ | User-friendly messages |
| Loading States | ✅ | Disabled buttons during action |
| Confirmations | ✅ | Dialogs for destructive actions |
| Responsive | ✅ | Mobile-friendly |

---

## Testing URLs

```
Admin Routes:
- Dashboard: http://localhost:3001/admin
- Professionals: http://localhost:3001/admin/professionals
- Professional Detail: http://localhost:3001/admin/professionals/[ID]
- Users: http://localhost:3001/admin/users
- User Detail: http://localhost:3001/admin/users/[ID]
```

---

## Common Tasks

### Block a User
1. Go to /admin/users
2. Find user in table
3. Click 🔒 Lock icon
4. User status changes to "Blocked"

### Delete a User
1. Go to /admin/users/:id
2. Scroll to "Admin Actions"
3. Click "Delete User"
4. Confirm in dialog
5. Redirected to /admin/users

### Reset User Password
1. Go to /admin/users/:id
2. Click "Reset Password"
3. Confirm action
4. User receives reset email

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check JWT token in localStorage |
| User not found | Verify user ID in URL |
| Network error | Check backend is running on :5000 |
| Changes not saving | Check browser console for errors |
| Sidebar not showing | Ensure admin role is set in localStorage |

---

## Environment Variables Needed

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000
```

**Backend (.env):**
```
MONGO_URI=mongodb://...
JWT_SECRET=your-secret-key
PORT=5000
```

---

## Performance Tips

1. **For large user lists (1000+):**
   - Add pagination: `?page=1&limit=20`
   - Implement search to filter

2. **For slower networks:**
   - Add debounce to search
   - Cache user list in Redux

3. **For better UX:**
   - Add loading skeletons
   - Implement virtual scrolling
   - Add bulk actions

---

## Related Features

- **Professional Management:** /admin/professionals
- **Dashboard Stats:** /admin (shows user count)
- **Admin Layout:** Shared navigation component
- **Protected Routes:** Role-based access control

---

**Last Updated:** May 10, 2026
**Status:** ✅ Complete & Ready for Testing
