import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { isLoggedIn, role } = useAuth();

  if ( isLoggedIn&& role) {
    if (role === "teacher") {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === "student") {
      return <Navigate to="/" replace />;
    }
  }

  return children; 
};

export default PublicOnlyRoute;
