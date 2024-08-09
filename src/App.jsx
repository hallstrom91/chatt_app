import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
// components
import SideNavigation from "@navigation/SideNavigation";
import Footer from "@layout/Footer";
import MainRoutes from "@routes/MainRoutes";
//context
import { ThemeProvider } from "@contexts/ThemeContext";
import { AuthProvider } from "@contexts/AuthContext";
import { UserProvider } from "@contexts/UserContext";
import { MessageProvider } from "@contexts/MessageContext";

//error handler
import ErrorBoundary from "@utils/ErrorBoundary";
import CookiePolicyHOC from "@utils/CookiePolicyHOC";

export default function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <MessageProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <CookiePolicyHOC>
                  <MainRoutes />
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
