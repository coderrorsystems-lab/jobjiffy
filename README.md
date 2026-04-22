# 🏠 UrbanClap Style Service Marketplace (MERN Stack)

A full-stack, scalable, and production-ready **UrbanClap / Urban Company clone** built using **MERN Stack + Tailwind CSS** with role-based access for Users, Professionals, and Admin.

---

## 🚀 Project Overview

This platform allows users to book professional services like:

* Home cleaning
* Beauty services
* Repair services
* Personal care

It includes real-time booking, payments, chat, admin control panel, and professional management.

---

## 👥 User Roles

### 1. 👤 User

* Signup/Login (OTP support)
* Browse services & professionals
* Book services
* Online payment
* Track booking status
* Chat with professionals
* Ratings & reviews
* Manage profile

### 2. 🧑‍🔧 Professional

* Register as service provider
* Upload KYC documents
* Get admin approval
* Manage services & pricing
* Accept/reject bookings
* Earnings dashboard
* Wallet & payouts

### 3. 🛠️ Admin

* Manage users & professionals
* Approve/reject providers
* Manage categories & services
* Control bookings
* Banner & advertisement management
* Reports & analytics
* Commission settings

---

## 🧰 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Redux Toolkit / Zustand
* Axios
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Socket.io
* bcrypt
* Helmet
* Rate Limiter

### Payments

* Razorpay (Primary)
* Cashfree (Optional)

---

## 🔐 Security Features

* JWT Authentication (Access + Refresh Tokens)
* Role-Based Access Control (RBAC)
* Password hashing (bcrypt)
* Input validation & sanitization
* Rate limiting
* Helmet security headers
* XSS & injection protection
* Secure payment webhook verification

---
frontend and backend structure 
client/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── robots.txt
│   └── images/
│       ├── banners/
│       ├── icons/
│       └── categories/
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── app/                       # App level config
│   │   ├── router.jsx
│   │   ├── providers.jsx
│   │   ├── store.js
│   │   └── axios.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── animations/
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Table.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   └── shared/
│   │       ├── ProtectedRoute.jsx
│   │       ├── RoleGuard.jsx
│   │       ├── EmptyState.jsx
│   │       └── Pagination.jsx
│
│   ├── pages/                    # Public pages
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Services.jsx
│   │   ├── CategoryDetails.jsx
│   │   ├── ProviderDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── NotFound.jsx
│
│   ├── features/                 # Feature based modules
│   │
│   │   ├── auth/
│   │   │   ├── authSlice.js
│   │   │   ├── authAPI.js
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ForgotPassword.jsx
│   │
│   │   ├── user/
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MyBookings.jsx
│   │   │   │   ├── Wallet.jsx
│   │   │   │   ├── Notifications.jsx
│   │   │   │   └── Profile.jsx
│   │   │   └── userAPI.js
│   │
│   │   ├── professional/
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Requests.jsx
│   │   │   │   ├── Earnings.jsx
│   │   │   │   ├── Reviews.jsx
│   │   │   │   ├── Availability.jsx
│   │   │   │   └── Profile.jsx
│   │   │   └── professionalAPI.js
│   │
│   │   ├── admin/
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   ├── Professionals.jsx
│   │   │   │   ├── Bookings.jsx
│   │   │   │   ├── Payments.jsx
│   │   │   │   ├── Banners.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   └── Settings.jsx
│   │   │   └── adminAPI.js
│   │
│   │   ├── booking/
│   │   │   ├── BookingCard.jsx
│   │   │   ├── BookingModal.jsx
│   │   │   ├── bookingAPI.js
│   │   │   └── bookingSlice.js
│   │
│   │   ├── payment/
│   │   │   ├── Checkout.jsx
│   │   │   ├── paymentAPI.js
│   │   │   └── PaymentSuccess.jsx
│   │
│   │   ├── banners/
│   │   │   ├── BannerSlider.jsx
│   │   │   └── bannerAPI.js
│   │
│   │   ├── reviews/
│   │   │   ├── ReviewCard.jsx
│   │   │   └── reviewAPI.js
│   │
│   │   └── chat/
│   │       ├── ChatWindow.jsx
│   │       └── socket.js
│
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   ├── useSocket.js
│   │   └── usePagination.js
│
│   ├── services/
│   │   ├── apiClient.js
│   │   ├── tokenService.js
│   │   └── socketService.js
│
│   ├── store/
│   │   └── index.js
│
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── currency.js
│   │   ├── validators.js
│   │   └── constants.js
│
│   └── styles/
│       └── index.css
│
├── .env
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json

## 💳 Payment Flow

1. User selects service
2. Booking created
3. Payment via Razorpay
4. Webhook verification
5. Booking confirmed
6. Professional assigned
7. Completion & review

---

## 📢 Banner / Advertisement System

Admin can manage homepage banners:

* Upload images
* Set title & description
* Add redirect links
* Enable/disable banners
* Schedule promotions

---

## ⚡ Real-Time Features

* Booking notifications
* Chat system (User ↔ Professional)
* Live booking updates
* Admin alerts

---

## 🗄️ Database Models

* Users
* Professionals
* Admins
* Services
* Categories
* Bookings
* Payments
* Reviews
* Banners
* Chats
* Notifications
* Wallets

---

## 📱 Responsive Design

* Mobile-first UI
* Tablet optimized
* Desktop dashboard
* Tailwind CSS utilities

---

## 📈 Scalability Approach

* Feature-based modular architecture
* Microservice-ready structure
* Independent modules (low dependency coupling)
* Socket-based real-time system

---

## 🛠️ Setup Instructions

### Backend

```
cd server
npm install
npm run dev
```

### Frontend

```
cd client
npm install
npm run dev
```

---

## 🌐 Deployment

* Frontend: Vercel / Netlify
* Backend: AWS / Render / VPS
* Database: MongoDB Atlas

---

## 💡 Future Improvements

* AI-based service recommendation
* Dynamic pricing
* Mobile app (React Native)
* Multi-language support
* Subscription plans

