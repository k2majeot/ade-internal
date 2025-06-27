import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Role } from "@shared/types";
import { hasRequiredRole } from "@shared/utils";

export function ProtectedRoute({
  children,
  minRole = "User",
}: {
  children: React.ReactNode;
  minRole?: Role;
}) {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;
  if (!hasRequiredRole(user.role, minRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}
