import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { isAuthenticated, getUserRole } from "./utils/authUtils";
import ScrollToTop from "./utils/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BrandIntroOverlay from "./components/shared/BrandIntroOverlay";
import Home from "./pages/Home";
import AllServicesPage from "./pages/AllServicesPage";
import AllProfessionalsPage from "./pages/AllProfessionalsPage";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import ServiceProfessionals from "./pages/ServiceProfessionals";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import Settings from "./pages/Profile/Settings";
import { BookingDashboard } from "./features/booking";
import {
  Login,
  RegisterOptionsPage,
  RegisterPage,
  ProfessionalRegisterPage,
  ForgotPasswordPage,
  OTPVerifyPage,
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
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/forgot-password') || location.pathname.startsWith('/verify-otp');
  
  // Get auth state
  const userIsAuthenticated = isAuthenticated();
  const userRole = getUserRole();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <BrandIntroOverlay />

      {/* Navbar - Hide on professional routes and auth pages */}
      {!isProfessionalRoute && !isAuthPage && (
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <main className={isProfessionalRoute ? "flex-1" : "flex-1 pt-16 md:pt-20"}>
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
          <Route path="/verify-otp" element={<OTPVerifyPage />} />

          {/* ==================== PROTECTED USER ROUTES ==================== */}
          
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['user']}
              >
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user/edit-profile"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['user']}
              >
                <EditProfile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user/settings"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['user']}
              >
                <Settings />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['user']}
              >
                <BookingDashboard />
              </ProtectedRoute>
            }
          />

          {/* ==================== PROTECTED PROFESSIONAL ROUTES ==================== */}
          
          <Route
            path="/professional/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['professional']}
              >
                <ProfessionalLayout>
                  <Dashboard />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/bookings"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['professional']}
              >
                <ProfessionalLayout>
                  <Bookings />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/profile"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['professional']}
              >
                <ProfessionalLayout>
                  <ProfessionalProfile />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/availability"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['professional']}
              >
                <ProfessionalLayout>
                  <Availability />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/earnings"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['professional']}
              >
                <ProfessionalLayout>
                  <Earnings />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/reviews"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['professional']}
              >
                <ProfessionalLayout>
                  <Reviews />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/settings"
            element={
              <ProtectedRoute
                isAuthenticated={userIsAuthenticated}
                userRole={userRole}
                allowedRoles={['professional']}
              >
                <ProfessionalLayout>
                  <ProfessionalSettings />
                </ProfessionalLayout>
              </ProtectedRoute>
            }
          />

          {/* ==================== CATCH-ALL (404) ==================== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer - Hide on professional routes and auth pages */}
      {!isProfessionalRoute && !isAuthPage && <Footer />}
    </div>
  );
}
