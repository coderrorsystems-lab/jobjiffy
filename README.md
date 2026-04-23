# 🏠 UrbanClap Style Service Marketplace (MERN Stack)

A full-stack, scalable, production-ready **UrbanClap / Urban Company clone** built using **MERN Stack + Tailwind CSS** with role-based access for Users, Professionals, and Admin.

---

## 🚀 Project Overview

This platform allows users to book professional home and personal services like:

* Home cleaning
* Beauty services
* Repair services
* Appliance servicing
* Personal care

It includes real-time booking, secure payments, chat system, admin control panel, banners/ads system, and professional management.

---

## 👥 User Roles

### 👤 User

* Signup / Login (OTP optional)
* Browse services & professionals
* Book services
* Online payment (Razorpay)
* Track booking status
* Chat with professionals
* Ratings & reviews
* Profile management
* Booking history

### 🧑‍🔧 Professional

* Register as service provider
* Upload KYC documents
* Admin approval required
* Manage services & pricing
* Accept / reject bookings
* Earnings dashboard
* Wallet & payout requests

### 🛠️ Admin

* Manage users & professionals
* Approve/reject providers
* Manage categories & services
* Booking monitoring
* Banner & advertisement control
* Reports & analytics
* Commission management
* System control panel

---

## 🧰 Tech Stack

### Frontend

* React.js (Vite)
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
* bcrypt
* Socket.io
* Helmet (Security)
* Rate Limiting

### Payments

* Razorpay (Primary)
* Cashfree (Optional)

---

## 🔐 Security Features

* JWT Access + Refresh Tokens
* Role-Based Access Control (RBAC)
* Password hashing (bcrypt)
* Input validation & sanitization
* Rate limiting on APIs
* Helmet security headers
* XSS & injection protection
* Secure webhook verification (payments)
* Audit logs for admin actions

---

## 📁 Project Structure

## 🖥️ Frontend (client)

```bash
client/
├── public/
│   ├── images/
│   │   ├── banners/
│   │   ├── icons/
│   │   └── categories/
│
├── src/
│   ├── app/
│   │   ├── router.jsx
│   │   ├── providers.jsx
│   │   ├── store.js
│   │   └── axios.js
│
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│
│   ├── pages/
│   ├── features/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── professional/
│   │   ├── admin/
│   │   ├── booking/
│   │   ├── payment/
│   │   ├── banners/
│   │   └── chat/
│
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── utils/
│   └── styles/
```

---

## 🧠 Backend (server)

```bash
server/
├── src/
│   ├── config/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── professionals/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── banners/
│   │   ├── admin/
│   │   └── notifications/
│
│   ├── middlewares/
│   ├── utils/
│   ├── sockets/
│   ├── app.js
│   └── server.js
```

---

## 💳 Payment Flow

1. User selects service
2. Booking created
3. Payment via Razorpay
4. Webhook verification
5. Booking confirmed
6. Professional assigned
7. Service completed
8. Review & rating

---

## 📢 Banner / Advertisement System

Admin can control homepage promotions:

* Upload banner images
* Add title & description
* Redirect links
* Activate / deactivate banners
* Schedule campaigns

---

## ⚡ Real-Time Features

* Booking notifications
* Chat (User ↔ Professional)
* Live booking status updates
* Admin alerts

---

## 🗄️ Database Collections

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
* Audit logs

---

## 📱 UI / UX Requirements

* Fully responsive (mobile-first)
* Tailwind CSS only
* Clean reusable components
* Fast loading performance
* Smooth animations

---

## 📈 Scalability Approach

* Feature-based modular architecture
* Independent modules (low coupling)
* Socket-based real-time system
* Microservice-ready structure

---

## 🛠️ Setup Instructions

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
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

## 💡 Future Enhancements

* AI-based service recommendations
* Dynamic pricing system
* Mobile app (React Native)
* Multi-language support
* Subscription plans
* Advanced analytics dashboard

---

## 🏁 Conclusion

This project is designed as a **production-grade scalable service marketplace**, suitable for high-value client projects (~₹10 lakh+), with strong focus on security, performance, and real-world usability.


👤 1. USER REGISTRATION (Simple & Fast)

👉 Goal: Quick signup + instant usage

Required Fields:
Full Name
Mobile Number (OTP verification best)
Email (optional but recommended)
Password
Location (City / Address)
Profile Photo (optional)


🧑‍🔧 2. PROFESSIONAL REGISTRATION (Detailed + Verified)

👉 Goal: Trust + verification + service provider setup

Step 1: Basic Info 
Full Name
Mobile Number (OTP)
Email
Password

Step 2: Professional Details
Skills / Category (AC repair, Beauty, Cleaning, etc.)
Experience (years)
Services Offered (checkbox or array)
Price per service (starting price)
Service Area (city/locality)
Profile Description (bio)
Profile Photo

Step 3: Identity Verification (KYC)
Aadhar Card / PAN Card
Address Proof
Profile photo (mandatory)

Step 4: Banking Details (for payments)
Bank Account Number
IFSC Code
Account Holder Name
UPI ID (optional)
⚠️ Admin Approval Required


After registration:
👉 Status = pending
👉 Admin approves → then professional becomes active