import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, allowedRoles }) {
  // ✅ Get auth state from Redux
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // ❌ Not logged in → login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed → unauthorized page
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Access granted
  return children;
}

export default ProtectedRoute;
