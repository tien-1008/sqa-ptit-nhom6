import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}
