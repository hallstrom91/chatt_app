import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
// components
import Navigation from "@shared/Navigation";
import Footer from "@shared/Footer";
// routes
import PublicRoutes from "@routes/PublicRoutes";
import PrivateRoutes from "@routes/PrivateRoutes";

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
      <Footer />
    </>
  );
}
