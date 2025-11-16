import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingAnimation } from "./LoadingAnimation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireDoctor?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false, requireDoctor = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isDoctor } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireDoctor && !isDoctor) {
    return <Navigate to="/patient-management" replace />;
  }

  return <>{children}</>;
};
