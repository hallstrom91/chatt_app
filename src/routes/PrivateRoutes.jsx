import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import Dashboard from "@pages/Dashboard";
import ChatInterface from "@pages/ChatInterface";

export default function PrivateRoutes() {
  return (
    <>
      <Routes>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatInterface />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
