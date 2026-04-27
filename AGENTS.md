# Jobjiffy

MERN stack service marketplace (UrbanClap clone).

## Running the project

- **Server**: `cd server && npm run dev` (Express on port 5000, nodemon)
- **Client**: `cd client && npm run dev` (Vite on port 3000)

Both use ES modules (`"type": "module"` in package.json).

## Project structure

- `server/src/` - Express backend, modular architecture in `modules/`
- `client/src/` - React frontend, feature-based structure in `features/`

## Commands

- Server: `cd server && npm run dev` | `npm run start`
- Client: `npm run dev` | `npm run build` | `npm run preview`

## Auth Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/user` | POST | User registration |
| `/api/auth/register/professional` | POST | Professional registration (pending approval) |
| `/api/auth/login` | POST | Email/password login |
| `/api/auth/refresh-token` | POST | Refresh access token |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/admin/login` | POST | Hardcoded admin login |
| `/api/auth/profile` | GET | Get user profile |
| `/api/auth/profile` | PUT | Update profile |
| `/api/auth/change-password` | POST | Change password |

## Notes

- No test, lint, or typecheck scripts configured
- Client uses custom theme system (see `client/THEME_SYSTEM.md`)
- Server requires `.env` file in `server/` directory with MongoDB URI
- Admin credentials hardcoded in `.env` (change password hash for production)