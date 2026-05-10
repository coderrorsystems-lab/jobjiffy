# User Management - Quick Guide

## How to Access User Management

### Step 1: Login as Admin
1. Go to http://localhost:3001/login
2. Click the **"Admin"** button (red button)
3. Enter admin credentials
4. You'll be redirected to /admin dashboard

### Step 2: Navigate to Users
**Option A - From Dashboard:**
- Click the **"Users"** stat card showing user count
- Or click **"Manage Users"** button

**Option B - From Sidebar:**
- Click **"Users"** in the left sidebar navigation

### Step 3: User List Page (/admin/users)
View all users in a table with:

| Column | Details |
|--------|---------|
| Name | User's full name |
| Email | Email address |
| Phone | Phone number |
| Joined | Account creation date |
| Status | Active (green) or Blocked (red) badge |
| Actions | View, Block/Unblock, Delete buttons |

### Step 4: User Actions

#### View User Details
- Click the **👁️ Eye icon** or row
- Shows complete user profile

#### Block/Unblock User
- Click the **🔒 Lock icon** (active) or **🔓 Unlock icon** (blocked)
- Status updates immediately in the table

#### Delete User Account
- Click the **🗑️ Trash icon**
- Confirm deletion in dialog
- User is permanently removed

### Step 5: User Detail Page (/admin/users/:id)

**Left Section - User Information:**
- Full name and email
- Phone number
- Account status badge
- Member since date
- Last login date
- Email verification status
- Complete address (if provided)
- Bio/About section

**Right Section - Admin Actions:**

**🔄 Reset Password**
- Sends password reset email to user
- User can create new password
- Confirm action in dialog

**🔒 Block/Unblock User**
- Blocks (prevents login) or unblocks user
- Status badge updates accordingly
- User remains in system

**🗑️ Delete User**
- Permanently removes user account
- Cannot be undone
- Strong confirmation required
- Returns to user list after deletion

## Error Handling

All actions include:
- ✅ Success messages
- ❌ Error messages with details
- 🔄 Automatic refresh on success
- ⚠️ Confirmation dialogs for destructive actions

## Examples

### Block a Spam User
1. Find user in list
2. Click lock icon in Actions
3. Status changes from "Active" to "Blocked"
4. User cannot login anymore

### Delete Fake Account
1. Click eye icon to view details
2. Scroll to "Admin Actions" section
3. Click "Delete User" button
4. Confirm deletion
5. Account and all data removed

### Reset User Password
1. Go to user detail page
2. Click "Reset Password" button
3. Confirm action
4. Email sent to user
5. User can set new password via link

## Navigation Structure

```
Admin Panel
├── Dashboard (/admin)
│   ├── Professionals stat
│   └── Users stat
├── Professionals (/admin/professionals)
│   └── Professional Detail (/admin/professionals/:id)
└── Users (/admin/users)
    └── User Detail (/admin/users/:id)
```

## Keyboard Shortcuts (if implemented)
- `Escape` - Close modals/dialogs
- `Tab` - Navigate between actions

## Performance Notes
- User list loads all users (consider pagination for 1000+ users)
- Each row click loads full user details
- Delete action is instant (confirm first)
- Block/unblock is instant (local state updates)
