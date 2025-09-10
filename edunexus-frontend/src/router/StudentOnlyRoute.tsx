import { Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

interface StudentOnlyRouteProps {
  children: React.ReactNode;
}

const StudentOnlyRoute = ({ children }: StudentOnlyRouteProps) => {
  const { isLoggedIn, role } = useAuth();

  // If logged in and not a student → redirect to their own dashboard
  if (isLoggedIn && role === "teacher") {
    return <Navigate to="/teacher/dashboard" replace />;
  }
  if (isLoggedIn && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise (student OR not logged in) → allow
  return <>{children}</>;
};

export default StudentOnlyRoute;
