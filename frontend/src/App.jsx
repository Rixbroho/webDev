import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 1. Import your Home component
import Home from "./pages/users/Home"; 
import LogIn from "./pages/LogIn";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import UserPages from "./pages/users";
import ProtectedRoute from "./protected/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Note: ensure these paths match your Route definitions below
    if (userData.role === "admin") {
      navigate("/admindashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/"); // Redirect back to Home on logout
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-emerald-500 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading TurfTime...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 2. Set Home as the default root page */}
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <LogIn
            onSwitchToSignup={() => navigate("/register")}
            onLogin={handleLogin}
          />
        }
      />
      <Route
        path="/register"
        element={
          <SignIn
            onSwitchToLogin={() => navigate("/login")}
            isAuthenticated={isAuthenticated}
          />
        }
      />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
        <Route path="/user" element={<UserPages />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<UserPages user={user} onLogout={handleLogout} />}
          />
        }
      />
      
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute
            element={<AdminDashboard onLogout={handleLogout} />}
          />
        }
      />

      {/* 3. Global fallback: If user enters a wrong URL, take them home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
      <AppContent />
    </Router>
  );
}

export default App;