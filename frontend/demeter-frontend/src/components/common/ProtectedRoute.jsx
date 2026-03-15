import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

/**
 * Route-level guard that checks authentication and optionally required roles.
 * - If not authenticated → redirects to /login
 * - If authenticated but wrong role → redirects to the user's home page
 * - Otherwise → renders children
 *
 * @param {string[]} [allowedRoles] - If provided, user.role must be in this list.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to the correct home page for their role
    if (user?.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user?.role === "STAFF") return <Navigate to="/staff" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
