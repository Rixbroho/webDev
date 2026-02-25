import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  // Double-check: verify token exists in localStorage
  const token = localStorage.getItem('token');
  
  // If no token exists, redirect to login regardless of isAuthenticated state
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Get user data from localStorage
  const userDataStr = localStorage.getItem('user');
  let user = null;
  
  try {
    user = userDataStr ? JSON.parse(userDataStr) : null;
  } catch (error) {
    // If parsing fails, clear localStorage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;