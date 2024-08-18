import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "@layout/Footer";
import { ThemeProvider } from "@contexts/ThemeContext";
import { AuthProvider } from "@contexts/AuthContext";
import { UserProvider } from "@contexts/UserContext";
import { MessageProvider } from "@contexts/MessageContext";
import ErrorBoundary from "@utils/ErrorBoundary";
import CookiePolicyHOC from "@utils/CookiePolicyHOC";
import AllRoutes from "./routes/AllRoutes";

export default function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <MessageProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <CookiePolicyHOC>
                  <AllRoutes />
                  <Footer />
                </CookiePolicyHOC>
              </ErrorBoundary>
            </ThemeProvider>
          </MessageProvider>
        </UserProvider>
      </AuthProvider>
    </>
  );
}
