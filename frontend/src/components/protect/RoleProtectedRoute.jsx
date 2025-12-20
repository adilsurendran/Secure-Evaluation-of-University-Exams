import { Navigate } from "react-router-dom";

/**
 * @param {Array} allowedRoles - e.g. ["admin"], ["student"], ["staff", "college"]
 */
export default function RoleProtectedRoute({ allowedRoles, children }) {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Logged in but wrong role
    return <Navigate to="/" replace />;
  }

  return children;
}
