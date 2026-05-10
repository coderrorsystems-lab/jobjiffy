import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import ScrollToTop from "./utils/ScrollToTop";
import Navbar from "./features/booking/layout/Navbar";
import Footer from "./features/booking/layout/Footer";
import BrandIntroOverlay from "./features/user/shared/BrandIntroOverlay";
import Home from "./features/user/home/Home";
import AllServicesPage from "./features/user/AllServicesPage";
import AllProfessionalsPage from "./features/professional/profile/AllProfessionalsPage";
import ProfessionalDetail from "./features/professional/ProfessionalDetail";
import ServiceProfessionals from "./pages/ServiceProfessionals";
import About from "./features/user/About";
import Contact from "./features/user/home/Contact";
import Profile from "./features/user/profile";
import EditProfile from "./features/user/profile/EditProfile";
import Settings from "./features/user/profile/Settings";
import { BookingDashboard } from "./features/booking";
import {
  Login,
  RegisterOptionsPage,
  RegisterPage,
  ProfessionalRegisterPage,
  ForgotPasswordPage,
} from "./features/auth";
import {
  ProfessionalLayout,
  Dashboard,
  Bookings,
  Availability,
  Earnings,
  Reviews,
  Settings as ProfessionalSettings,
  Profile as ProfessionalProfile,
} from "./features/professional";
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminProfessionals from "./features/admin/AdminProfessionals";
import AdminProfessionalDetail from "./features/admin/AdminProfessionalDetail";
import AdminUsers from "./features/admin/AdminUsers";
import AdminUserDetail from "./features/admin/AdminUserDetail";
import AdminLayout from "./features/admin/AdminLayout";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isProfessionalRoute = location.pathname.startsWith('/professional');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/forgot-password') || location.pathname.startsWith('/verify-otp');

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <BrandIntroOverlay />

      {/* Navbar - Hide on professional, admin routes and auth pages */}
      {!isProfessionalRoute && !isAdminRoute && !isAuthPage && (
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <main className={isProfessionalRoute || isAdminRoute ? "flex-1" : "flex-1 pt-16 md:pt-20"}>
        <Routes>
          {/* ==================== PUBLIC ROUTES (No Login Required) ==================== */}
          
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<AllServicesPage />} />
          <Route path="/professionals" element={<AllProfessionalsPage />} />
          <Route path="/professional/:userId" element={<ProfessionalDetail />} />
          <Route path="/services/:serviceSlug" element={<ServiceProfessionals />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* ==================== AUTH ROUTES ==================== */}
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterOptionsPage />} />
          <Route path="/register/user" element={<RegisterPage />} />
          <Route path="/register/professional" element={<ProfessionalRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ==================== PROTECTED USER ROUTES ==================== */}
          
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user/edit-profile"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user/settings"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <BookingDashboard />
              </ProtectedRoute>
            }
          />

          {/* ==================== PROTECTED PROFESSIONAL ROUTES ==================== */}
          
          <Route
            path="/professional/dashboard"
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalLayout>
                  <Dashboard />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/bookings"
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalLayout>
                  <Bookings />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/profile"
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalLayout>
                  <ProfessionalProfile />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/availability"
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalLayout>
                  <Availability />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/earnings"
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalLayout>
                  <Earnings />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/reviews"
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalLayout>
                  <Reviews />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/settings"
            element={
              <ProtectedRoute allowedRoles={['professional']}>
                <ProfessionalLayout>
                  <ProfessionalSettings />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== ADMIN ROUTES ==================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/professionals"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminProfessionals />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/professionals/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminProfessionalDetail />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminUserDetail />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer - Hide on professional, admin routes and auth pages */}
      {!isProfessionalRoute && !isAdminRoute && !isAuthPage && <Footer />}
    </div>
  );
}
