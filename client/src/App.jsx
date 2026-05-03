import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import ScrollToTop from "./utils/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BrandIntroOverlay from "./components/shared/BrandIntroOverlay";
import Home from "./pages/Home";
import AllProfessionals from "./pages/AllProfessionals";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import ServiceProfessionals from "./pages/ServiceProfessionals";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
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
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <BrandIntroOverlay />

      {/* Navbar - Hide on professional routes */}
      {!isProfessionalRoute && (
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <main className={isProfessionalRoute ? "flex-1" : "flex-1 pt-16 md:pt-20"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/professionals" element={<AllProfessionals />} />
          <Route path="/professional/:userId" element={<ProfessionalDetail />} />
          <Route path="/services/:serviceSlug" element={<ServiceProfessionals />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterOptionsPage />} />
          <Route path="/register/user" element={<RegisterPage />} />
          <Route path="/register/professional" element={<ProfessionalRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<OTPVerifyPage />} />

          {/* User Routes */}
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/edit-profile" element={<EditProfile />} />
          <Route path="/user/settings" element={<Settings />} />
          <Route path="/user/bookings" element={<BookingDashboard />} />

          {/* Professional Routes */}
          <Route
            path="/professional/dashboard"
            element={
              <ProfessionalLayout>
                <Dashboard />
              </ProfessionalLayout>
            }
          />
          <Route
            path="/professional/bookings"
            element={
              <ProfessionalLayout>
                <Bookings />
              </ProfessionalLayout>
            }
          />
          <Route
            path="/professional/profile"
            element={
              <ProfessionalLayout>
                <ProfessionalProfile />
              </ProfessionalLayout>
            }
          />
          <Route
            path="/professional/availability"
            element={
              <ProfessionalLayout>
                <Availability />
              </ProfessionalLayout>
            }
          />
          <Route
            path="/professional/earnings"
            element={
              <ProfessionalLayout>
                <Earnings />
              </ProfessionalLayout>
            }
          />
          <Route
            path="/professional/reviews"
            element={
              <ProfessionalLayout>
                <Reviews />
              </ProfessionalLayout>
            }
          />
          <Route
            path="/professional/settings"
            element={
              <ProfessionalLayout>
                <ProfessionalSettings />
              </ProfessionalLayout>
            }
          />
        </Routes>
      </main>

      {/* Footer - Hide on professional routes */}
      {!isProfessionalRoute && <Footer />}
    </div>
  );
}
