import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
// components
import Navigation from "@shared/Navigation";
import Footer from "@shared/Footer";
// routes
import PublicRoute from "@routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/*" element={<PublicRoute />} />
        <Route path="/protected" element={<ProtectedRoute />} />
      </Routes>
      <Footer />
    </>
  );
}
