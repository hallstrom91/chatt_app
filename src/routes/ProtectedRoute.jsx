import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    <Navigate to="/" />;
  }
  return children;
}
