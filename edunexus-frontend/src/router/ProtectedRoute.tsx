// import { Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hook/useAuth";

// interface ProtectedRouteProps {
//   allowedRoles: string[]; 
// }

// const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
//   const { isLoggedIn, role } = useAuth();

//   if (!isLoggedIn || !role) {
//     return <Navigate to={`/login/${role || "student"}`} replace />;
//   }

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn || !role) {
    return <Navigate to={`/login/${role || "student"}`} replace />;
  }

  // role → home mapping
  const roleHomes: Record<string, string> = {
    student: "/",
    teacher: "/teacher/dashboard",
    admin: "/admin/dashboard",
  };

  // If the user's role is not allowed → redirect to their role's home
  if (!allowedRoles.includes(role)) {
    return <Navigate to={roleHomes[role] || "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
