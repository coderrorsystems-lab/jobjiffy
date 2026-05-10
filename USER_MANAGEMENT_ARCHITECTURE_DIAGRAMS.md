# User Management - Visual Flowcharts & Architecture

## 1. User List Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AdminUsers.jsx                           │
│              (User Management List Page)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐         ┌────────┐        ┌────────┐
    │ Load   │         │ Block  │        │Delete  │
    │Users   │         │User    │        │User    │
    └────────┘         └────────┘        └────────┘
        │                  │                  │
        ▼                  ▼                  ▼
   fetchUsers()     blockUser(id)      deleteUser(id)
        │                  │                  │
        ▼                  ▼                  ▼
   GET /users      PUT /users/:id      DELETE /users/:id
                    {isActive:F}
        │                  │                  │
        ▼                  ▼                  ▼
   API Response   Update State        Redirect List
        │                  │                  │
        ▼                  ▼                  ▼
   Render Table    Refresh Row      Remove from List
```

---

## 2. User Detail Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  AdminUserDetail.jsx                         │
│              (User Profile & Actions Page)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────────────┐
        │                  │                          │
        ▼                  ▼                          ▼
   ┌─────────┐         ┌─────────┐            ┌────────────┐
   │ View    │         │ Block/  │            │ Reset      │
   │Profile  │         │Unblock  │            │Password    │
   └─────────┘         └─────────┘            └────────────┘
        │                  │                          │
        ▼                  ▼                          ▼
   fetchUser()      blockUser(id)        resetUserPassword(id)
        │                  │                          │
        ▼                  ▼                          ▼
   GET /users/:id   PUT /users/:id/block  POST /users/:id/reset-password
                    {isActive:T/F}
        │                  │                          │
        ▼                  ▼                          ▼
   Render Profile  Update UI Badge       Send Email
   + Actions       + Update State        + Notify User
```

---

## 3. Navigation Architecture

```
┌─────────────────────────────────────────────┐
│              AdminLayout.jsx                 │
│           (Sidebar Navigation)               │
└──────────┬──────────────────────────────────┘
           │
    ┌──────┴──────┬──────────┬──────────┐
    │             │          │          │
    ▼             ▼          ▼          ▼
┌────────┐  ┌────────────┐ ┌─────┐  ┌───────┐
│Header  │  │Dashboard   │ │Prof │  │Users  │ ◄── NEW
│        │  │Link        │ │Link │  │Link   │
└────────┘  └────────────┘ └─────┘  └───────┘
    │
    ├─► /admin
    ├─► /admin/professionals
    └─► /admin/users ◄── NEW

┌──────────────────────────────────────┐
│        Logout Button                  │
│      (Hidden in Main Content)         │
└──────────────────────────────────────┘
```

---

## 4. Component Hierarchy

```
                    App.jsx
                      │
          ┌───────────┼───────────┐
          │           │           │
         user        prof        admin
          │           │           │
          ▼           ▼           ▼
    User Routes  Prof Routes  Admin Routes
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
              AdminLayout  (wrapper)
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    Dashboard  Professionals  Users ◄─ NEW
                                │
                    ┌───────────┴──────────┐
                    │                      │
                    ▼                      ▼
              List View          Detail View ◄─ NEW
              (Table)           (Profile)
                 │                  │
         ┌───────┴─────────┐    ┌───┴───────────┐
         │       │         │    │      │         │
         ▼       ▼         ▼    ▼      ▼         ▼
       View   Block    Delete Info   Block    Delete
```

---

## 5. Data Flow Diagram

```
┌──────────────┐
│ User Action  │
│ (List Page)  │
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ Event Handler          │
│ (handleBlockToggle)    │
└──────┬────────────────┘
       │
       ▼
┌────────────────────────┐
│ API Call               │
│ (blockUser(id, bool))  │
└──────┬────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ adminAPI.js                        │
│ - Add auth header                  │
│ - PUT /users/:id/block             │
│ - Handle response/error            │
└──────┬───────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Express Route Handler              │
│ /api/admin/users/:id/block         │
│ - Verify JWT & admin role          │
│ - Call adminService.blockUser()    │
│ - Return updated user              │
└──────┬───────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ MongoDB Update                     │
│ User.findByIdAndUpdate()           │
│ { isActive: bool }                 │
└──────┬───────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Response Back to Client            │
│ { message: '...', user: {...} }    │
└──────┬───────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Update Local State                 │
│ setUsers() with new data           │
└──────┬───────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Re-render Component                │
│ Table updates with new status      │
└────────────────────────────────────┘
```

---

## 6. Authentication & Authorization Flow

```
┌──────────────────────────────────────┐
│     User Logs In as Admin            │
└──────────────────┬───────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │ Login Form Submit    │
         │ POST /auth/login     │
         └────────┬────────────┘
                  │
                  ▼
         ┌─────────────────────┐
         │ Backend Validates   │
         │ Email & Password    │
         └────────┬────────────┘
                  │
                  ▼
         ┌─────────────────────┐
         │ Check User Role     │
         │ role === 'admin'    │
         └────────┬────────────┘
                  │
            ┌─────┴─────┐
            │           │
          ✅ YES       ❌ NO
            │           │
            ▼           ▼
    ┌──────────────┐  ┌──────────────┐
    │ Return JWT   │  │ Return Error │
    │ + role: admin│  │ 403 Forbidden│
    └──────┬───────┘  └──────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ Save in localStorage │
    │ - token              │
    │ - role: 'admin'      │
    └──────┬───────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ Navigate to /admin   │
    │ ProtectedRoute       │
    │ checks role          │
    └──────┬───────────────┘
           │
     ┌─────┴──────┐
     │            │
   ✅ admin    ❌ other
     │            │
     ▼            ▼
  Show       Redirect to
 Admin      appropriate
 Layout     role route
```

---

## 7. Admin User Management Journey

```
STEP 1: ADMIN DASHBOARD
┌──────────────────────────────────────┐
│  Welcome! JobJiffy Admin             │
│  ┌─────────────┬──────────┐          │
│  │Professionals│  Users   │ ◄─ Click
│  │      12     │    45    │
│  └─────────────┴──────────┘          │
└────────────┬─────────────────────────┘
             │
             ▼
STEP 2: USER LIST PAGE
┌──────────────────────────────────────┐
│  User Management                     │
│  ┌──────────────────────────────────┐│
│  │Name │Email   │Phone  │Status │ACT││
│  │─────┼────────┼───────┼───────┼───││
│  │John │j@.com  │9999   │Active │👁🔒🗑││
│  │Jane │j@.com  │8888   │Active │👁🔒🗑││
│  │Spam │s@.com  │7777   │Active │👁🔒🗑││
│  └──────────────────────────────────┘│
└────────────┬──────────────────────────┘
             │
      ┌──────┴──────┬──────┐
      │             │      │
      ▼             ▼      ▼
   VIEW         BLOCK   DELETE
    │            │        │
    ▼            ▼        ▼
STEP 3:      Toggle   Confirm?
DETAIL       Status       │
PAGE           │         ▼
│              │     Delete
│              ▼     Account
│           Updated
│           Table
│
└─► View Full Profile
    Location, Bio, History
    │
    ├─► Actions:
    │   - Reset Password
    │   - Block User
    │   - Delete User
    │
    └─► Handle Complaint
        (View profile info)
```

---

## 8. State Management Pattern

```
┌──────────────────────────────┐
│      AdminUsers.jsx          │
├──────────────────────────────┤
│ State:                       │
│  - users: []                 │
│  - loading: bool             │
│  - error: string             │
├──────────────────────────────┤
│ Effects:                     │
│  - useEffect → loadUsers()   │
├──────────────────────────────┤
│ Actions:                     │
│  - loadUsers()               │
│  - handleBlockToggle()       │
│  - handleDelete()            │
└──────────────────────────────┘
         │
         ├────────────┬────────────┐
         │            │            │
         ▼            ▼            ▼
      Fetch        Update       Delete
      All Users    One User     One User
         │            │            │
         ▼            ▼            ▼
    GET /users   PUT /:id/block DELETE /:id
         │            │            │
         ▼            ▼            ▼
    setUsers()    setUsers()   setUsers()
    (map)         (map)        (filter)
```

---

## 9. Error Handling Flow

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
    ┌─────────────────┐
    │ Try {           │
    │   API Call      │
    │ }               │
    └────────┬────────┘
             │
        ┌────┴────┐
        │         │
       ✅ OK    ❌ Error
        │         │
        ▼         ▼
    Update     Catch
    State      Error
        │         │
        │         ▼
        │     Extract
        │     Message
        │         │
        │         ▼
        │     setError(msg)
        │         │
        ▼         ▼
    Re-render  Display
    with       Error
    updates    Message
        │         │
        ▼         ▼
      User sees
      updated
      data &
      error
      toast
```

---

## 10. API Security Chain

```
┌────────────────────────────────┐
│  Client Request                │
│  GET /api/admin/users          │
└────────────────┬───────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ API Interceptor      │
        │ Add JWT Token Header │
        │ Authorization: Bearer│
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Express Middleware   │
        │ authenticate         │
        │ (Verify JWT)         │
        └────────┬─────────────┘
                 │
         ┌───────┴────────┐
         │                │
        ✅ Valid       ❌ Invalid
         │                │
         ▼                ▼
        │              401 Error
        │
        ▼
    ┌──────────────────────┐
    │ Express Middleware   │
    │ authorize('admin')   │
    │ (Check Role)         │
    └────────┬─────────────┘
             │
      ┌──────┴───────┐
      │              │
     ✅ Admin    ❌ Other
      │              │
      ▼              ▼
      │          403 Error
      │
      ▼
  ┌──────────────────────┐
  │ Route Handler        │
  │ adminController      │
  │ getAllUsers()        │
  └────────┬─────────────┘
           │
           ▼
  ┌──────────────────────┐
  │ Database Query       │
  │ User.find()          │
  │ .select('-password') │
  └────────┬─────────────┘
           │
           ▼
  ┌──────────────────────┐
  │ Return Users         │
  │ (No passwords!)      │
  │ 200 OK               │
  └──────────────────────┘
```

---

## Summary

This visual architecture shows:

1. **User Flow** - How users interact with the admin panel
2. **Data Flow** - How data moves through the system
3. **API Flow** - Request/response lifecycle
4. **Security** - Authentication & authorization checks
5. **Component Structure** - Hierarchical layout
6. **State Management** - Data updates and UI re-renders
7. **Error Handling** - Exception management
8. **Navigation** - Routing structure

All components work together to provide a secure, efficient, and user-friendly admin experience! 🚀
