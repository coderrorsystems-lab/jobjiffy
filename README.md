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

## 📁 Project Structure

### Frontend

```
client/
src/
  app/
  components/
  features/
    auth/
    user/
    professional/
    admin/
    booking/
    payment/
    chat/
  pages/
  hooks/
  services/
  store/
  utils/
```

### Backend

```
server/
src/
  config/
  modules/
    auth/
    users/
    professionals/
    bookings/
    payments/
    banners/
    admin/
  middlewares/
  utils/
  sockets/
```

---

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

