import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hook/useAuth";

const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, role } = useAuth();

  useEffect(() => {
    if (isLoggedIn && role) {
      const publicRoutes = [
        "/login/student", "/login/teacher", "/login/admin",
        "/register/student", "/register/teacher", "/register/admin",
        "/forgot-password/admin", "/forgot-password/student", "/forgot-password/teacher",
        "/reset-password/admin", "/reset-password/student", "/reset-password/teacher",
        "/verify-otp/student", "/verify-otp/teacher", "/verify-otp/admin",
      ];
      const dashboards: Record<string, string> = {
        teacher: "/teacher/dashboard",
        admin: "/admin/dashboard",
        student: "/",
      };

      if (publicRoutes.includes(location.pathname)) {
        navigate(dashboards[role]);
        return;
      }

      if (role === "teacher" && !location.pathname.startsWith("/teacher")) {
        navigate("/teacher/dashboard");
        return;
      }
      if (role === "admin" && !location.pathname.startsWith("/admin")) {
        navigate("/admin/dashboard");
        return;
      }
      if (role === "student" && location.pathname.startsWith("/admin")) {
        navigate("/");
        return;
      }
      if (role === "student" && location.pathname.startsWith("/teacher")) {
        navigate("/");
        return;
      }
    }
  }, [isLoggedIn, role, location.pathname, navigate]);

  return null;
};

export default RedirectHandler;
