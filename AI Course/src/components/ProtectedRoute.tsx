import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "admin" | "instructor";
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    // No role required → it's a student-facing page; bounce to home where the login modal lives
    return <Navigate to={requiredRole ? "/admin/login" : "/"} replace />;
  }

  if (requiredRole === "admin" && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "instructor" && role !== "instructor" && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
