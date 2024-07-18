import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
// components
import Navigation from "@shared/Navigation";
import Footer from "@shared/Footer";
import MainRoutes from "@routes/MainRoutes";
//context
import { ThemeProvider } from "@contexts/ThemeContext";
import { AuthProvider } from "@contexts/AuthContext";
import { UserProvider } from "@contexts/UserContext";
import { MessageProvider } from "@contexts/MessageContext";
//error handler
import ErrroBoundary from "@utils/ErrorBoundary";

export default function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <MessageProvider>
            <ThemeProvider>
              <ErrroBoundary>
                <Navigation />
                <MainRoutes />
                <Footer />
              </ErrroBoundary>
            </ThemeProvider>
          </MessageProvider>
        </UserProvider>
      </AuthProvider>
    </>
  );
}
