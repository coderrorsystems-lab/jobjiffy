# User Management Feature - Testing Checklist

## Pre-Testing Setup

- [ ] Backend server running: `npm start` (in /server directory)
- [ ] Frontend dev server running: `npm run dev` (in /client directory)
- [ ] MongoDB is running and connected
- [ ] Environment variables configured
- [ ] Admin user account exists in database
- [ ] Browser console open for debugging
- [ ] Network tab open to check API calls

---

## Authentication & Navigation Tests

### Login as Admin
- [ ] Navigate to http://localhost:3001/login
- [ ] Click "Admin" button (red button)
- [ ] Enter valid admin credentials
- [ ] Successfully redirected to /admin dashboard
- [ ] Verify userRole in localStorage is "admin"
- [ ] Verify JWT token in localStorage

### Navbar Behavior for Admin
- [ ] Navbar shows on public pages (/, /about, /services)
- [ ] Navbar hidden on /admin/* routes
- [ ] Footer hidden on /admin/* routes
- [ ] Admin profile button shows "Admin Panel" instead of "Profile"
- [ ] Mobile menu only shows: Home, About, Services, Admin Panel
- [ ] User-specific menu items hidden (My Bookings, Support, Wallet, etc.)

### Admin Sidebar Navigation
- [ ] Sidebar renders on all admin routes
- [ ] "Dashboard" link navigates to /admin
- [ ] "Professionals" link navigates to /admin/professionals
- [ ] "Users" link navigates to /admin/users
- [ ] Active route highlighting works (blue background + border)
- [ ] Logout button appears at bottom
- [ ] Logout returns to login page

---

## Dashboard Tests

### Dashboard Stats Cards
- [ ] Dashboard page loads
- [ ] "Professionals" card shows count
- [ ] "Users" card shows
- [ ] Clicking "Professionals" card → navigates to /admin/professionals
- [ ] Clicking "Users" card → navigates to /admin/users
- [ ] Cards have hover effects

### Recent Professionals Section
- [ ] Shows recent 6 professionals
- [ ] Each item shows: name, email, status
- [ ] "View all" link navigates to /admin/professionals
- [ ] "View" button on each item navigates to detail page

---

## User List Page Tests (/admin/users)

### Page Load & Display
- [ ] Page title "User Management" displays
- [ ] Refresh button appears
- [ ] Users table loads with data
- [ ] Table has 6 columns: Name | Email | Phone | Joined | Status | Actions

### Table Content
- [ ] All users from database display in table
- [ ] Name column shows user full name
- [ ] Email column shows user email
- [ ] Phone column shows user phone
- [ ] Joined column shows account creation date in correct format
- [ ] Status badge shows "Active" (green) or "Blocked" (red)

### Table Actions
- [ ] Eye icon present in each row
- [ ] Lock icon present in each row (for active users)
- [ ] Unlock icon present in each row (for blocked users)
- [ ] Trash icon present in each row
- [ ] Icons have proper hover effects

### Refresh Button
- [ ] Click refresh button
- [ ] Table data reloads
- [ ] Loading state shows briefly

### Error Handling
- [ ] Network error displays message
- [ ] Invalid request shows error
- [ ] Empty user list shows "No users found"
- [ ] Error message has readable text

---

## User Detail Page Tests (/admin/users/:id)

### Page Navigation
- [ ] Click eye icon from user list
- [ ] Detail page loads for correct user
- [ ] URL shows /admin/users/[user-id]
- [ ] Back button navigates to /admin/users
- [ ] Invalid user ID shows "User not found"

### User Profile Display (Left Panel)
- [ ] User name displays prominently
- [ ] User email displays
- [ ] Status badge shows (Active/Blocked)
- [ ] Phone displays
- [ ] Member since date shows
- [ ] Last login date shows (if available)
- [ ] Email verified status shows
- [ ] Location displays (if available):
  - [ ] Street
  - [ ] City
  - [ ] State
  - [ ] Pincode
- [ ] Bio section shows (if available)

### Admin Actions (Right Panel)
- [ ] "Reset Password" button displays
- [ ] "Block User" button displays (or "Unblock User")
- [ ] "Delete User" button displays
- [ ] All buttons have proper icons
- [ ] User ID section shows (for reference)

---

## Block/Unblock User Tests

### From List Page
- [ ] Click lock icon on active user
- [ ] No error occurs
- [ ] User status badge changes to "Blocked" (red)
- [ ] Lock icon changes to unlock icon
- [ ] Click unlock icon
- [ ] User status badge changes to "Active" (green)
- [ ] Unlock icon changes to lock icon

### From Detail Page
- [ ] Click "Block User" button
- [ ] Confirmation dialog does NOT appear (quick toggle)
- [ ] Status badge updates to "Blocked"
- [ ] Button text changes to "Unblock User"
- [ ] Click "Unblock User"
- [ ] Status updates to "Active"
- [ ] Button text changes to "Block User"

### Blocked User Behavior
- [ ] Blocked user cannot login (backend enforces)
- [ ] User's isActive field in DB becomes false
- [ ] Blocked users still appear in user list
- [ ] Blocked users can be unblocked

---

## Password Reset Tests

### From Detail Page
- [ ] Click "Reset Password" button
- [ ] Confirmation dialog appears
- [ ] Dialog shows user's email
- [ ] Confirmation buttons: Cancel, Confirm
- [ ] Click Cancel → Dialog closes, no action
- [ ] Click Confirm
  - [ ] Button shows loading state
  - [ ] API call made to POST /users/:id/reset-password
  - [ ] Success message shows "Password reset email sent"
  - [ ] Dialog closes
  - [ ] Button loading state clears

### Email Behavior (Backend Ready)
- [ ] Password reset endpoint exists
- [ ] User receives password reset email (when email configured)
- [ ] Email contains reset link/token
- [ ] User can click link and reset password

### Error Cases
- [ ] Invalid user ID shows error
- [ ] Network error shows error message
- [ ] Error message clears when trying again

---

## Delete User Tests

### From List Page
- [ ] Click trash icon
- [ ] Confirmation dialog appears
- [ ] Dialog text: "Are you sure? This action cannot be undone."
- [ ] Click Cancel → Dialog closes, user remains
- [ ] Click OK
  - [ ] Confirmation request sends
  - [ ] User removed from table
  - [ ] Page updates without reload
  - [ ] User no longer appears in list

### From Detail Page
- [ ] Click "Delete User" button
- [ ] Confirmation dialog appears
- [ ] Dialog mentions permanent deletion
- [ ] Click Cancel → Dialog closes, page remains
- [ ] Click Confirm
  - [ ] User is deleted
  - [ ] Redirected to /admin/users
  - [ ] User no longer appears in list
  - [ ] Success message shows (if implemented)

### Deleted User Behavior
- [ ] User account completely removed from database
- [ ] Cannot login again (user no longer exists)
- [ ] User data not recoverable (permanent)
- [ ] Other users not affected

### Error Cases
- [ ] Invalid user ID shows error
- [ ] Network error shows error message
- [ ] Remains on detail page if delete fails

---

## UI/UX Tests

### Responsive Design
- [ ] Desktop view (1920px): Full table visible
- [ ] Tablet view (768px): Table responsive
- [ ] Mobile view (375px): 
  - [ ] Table scrollable OR simplified
  - [ ] Buttons still clickable
  - [ ] Text readable

### Icons & Styling
- [ ] Eye icon visible and clickable (18px)
- [ ] Lock/Unlock icon visible and clickable (18px)
- [ ] Trash icon visible and clickable (18px)
- [ ] Status badges color-coded correctly
- [ ] Hover effects work on buttons
- [ ] Dark theme applied consistently

### Loading & Error States
- [ ] Loading text/skeleton shows while fetching
- [ ] Error message styled in red/orange
- [ ] Success actions clear errors
- [ ] Disabled states on buttons during loading
- [ ] Toast notifications (if implemented)

---

## API Tests

### Network Requests
- [ ] Open DevTools Network tab
- [ ] GET /api/admin/users returns user array
- [ ] GET /api/admin/users/:id returns single user
- [ ] PUT /api/admin/users/:id/block sends isActive field
- [ ] DELETE /api/admin/users/:id sends delete request
- [ ] POST /api/admin/users/:id/reset-password sends trigger

### Response Validation
- [ ] All responses include status code 200 (success)
- [ ] Error responses include proper status codes (4xx/5xx)
- [ ] Password field never included in response
- [ ] RefreshToken field never included in response
- [ ] Response time reasonable (< 1s for typical operations)

### Headers Check
- [ ] Authorization header included (Bearer token)
- [ ] Content-Type: application/json
- [ ] CORS headers present

---

## Security Tests

### Authentication
- [ ] Without login, cannot access /admin/*
- [ ] Without valid JWT, API returns 401
- [ ] With expired JWT, API returns 401
- [ ] Without admin role, cannot access endpoints (403)

### Authorization
- [ ] User role cannot access /admin/users
- [ ] Professional role cannot access /admin/users
- [ ] Only admin role can access user management

### Data Protection
- [ ] Password field never visible in UI
- [ ] Refresh token never visible in UI
- [ ] Error messages don't leak sensitive data
- [ ] Console errors are user-friendly

### Destructive Actions
- [ ] Delete requires confirmation
- [ ] Cannot delete without explicit confirmation
- [ ] Confirmation dialog shows what will happen
- [ ] No undo after deletion

---

## Cross-Browser Tests

- [ ] Chrome/Edge (latest)
  - [ ] All features work
  - [ ] Styling correct
  - [ ] No console errors

- [ ] Firefox (latest)
  - [ ] All features work
  - [ ] Styling correct
  - [ ] No console errors

- [ ] Safari (latest)
  - [ ] All features work
  - [ ] Styling correct
  - [ ] Icons render properly

---

## Performance Tests

- [ ] User list loads in < 2 seconds
- [ ] Detail page loads in < 1 second
- [ ] Block/unblock action instant (< 500ms)
- [ ] Delete action instant (< 500ms)
- [ ] No memory leaks with repeated actions
- [ ] Smooth animations and transitions

---

## Integration Tests

### With Professional Management
- [ ] Can switch between /admin/professionals and /admin/users
- [ ] Both sections load independently
- [ ] Navigation works smoothly

### With Dashboard
- [ ] Users stat card navigates to /admin/users
- [ ] Dashboard loads independent of users page
- [ ] Sidebar navigation consistent

### With Logout
- [ ] Logout button works from any admin page
- [ ] Returns to login page
- [ ] localStorage cleared
- [ ] Cannot access admin pages after logout

---

## Edge Cases & Limits

- [ ] User with no location data displays gracefully
- [ ] User with no bio displays gracefully
- [ ] User with very long name displays with truncation
- [ ] User with very long email displays with truncation
- [ ] 100+ users in list loads without lag
- [ ] Rapid clicks on same button don't cause duplicate actions
- [ ] Network timeout shows error
- [ ] Server error shows error message

---

## Final Verification

### Functionality Checklist
- [ ] View Users ✅
- [ ] Block Users ✅
- [ ] Unblock Users ✅
- [ ] Delete Users ✅
- [ ] Reset Password ✅
- [ ] Handle Complaints (via detail view) ✅

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] Clean code formatting
- [ ] Proper error handling
- [ ] Loading states present
- [ ] Responsive design working

### Documentation
- [ ] README updated
- [ ] API endpoints documented
- [ ] User guide created
- [ ] Code comments present
- [ ] No broken links

---

## Sign-Off

- [ ] All tests passed ✅
- [ ] No critical bugs found ✅
- [ ] Ready for production ✅
- [ ] Team reviewed ✅
- [ ] Performance acceptable ✅
- [ ] Security verified ✅

---

## Testing Summary

| Category | Tests | Passed |
|----------|-------|--------|
| Authentication | 5 | ☐ |
| Navigation | 8 | ☐ |
| Dashboard | 5 | ☐ |
| User List | 10 | ☐ |
| User Detail | 8 | ☐ |
| Block/Unblock | 7 | ☐ |
| Password Reset | 6 | ☐ |
| Delete User | 8 | ☐ |
| UI/UX | 10 | ☐ |
| API | 8 | ☐ |
| Security | 6 | ☐ |
| **TOTAL** | **81** | **☐** |

**Status:** Ready for testing! 🧪

Date: __________
Tester: __________
Result: __________
