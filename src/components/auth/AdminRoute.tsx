
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { hasRole } = useAuth();
  
  if (!hasRole(["ADM" as const, "system_admin" as const])) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
