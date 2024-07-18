import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const { user, jwtToken, logout } = useAuth();

  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  if (!user || !jwtToken || isTokenExpired(jwtToken)) {
    logout();
    return <Navigate to="/" replace />;
  }

  return children;
}
