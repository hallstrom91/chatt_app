import React from "react";
import { Routes, Route } from "react-router-dom";
import UserInterface from "@pages/UserInterface";

export default function ProtectedRoute() {
  return (
    <>
      <Routes>
        <Route path="/ui" element={<UserInterface />} />
      </Routes>
    </>
  );
}
