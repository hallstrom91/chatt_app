import { useState, useEffect } from "react";
import { useTheme } from "@hooks/useContextHooks";
import Footer from "@layout/Footer";
import ErrorBoundary from "@utils/ErrorBoundary";
import CookiePolicyHOC from "@utils/CookiePolicyHOC";
import AllRoutes from "./routes/AllRoutes";
import Cookies from "js-cookie";
import "./App.css";

export default function App() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // check user sys-settings
    const userHasDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    // check user cookie
    const savedTheme = Cookies.get("theme");

    if (!savedTheme) {
      const initialTheme = userHasDarkMode ? "dark" : "light";
      Cookies.set("theme", initialTheme, {
        expires: 365,
        path: "/",
        sameSite: "Lax",
      });
      setTheme(initialTheme);
    } else {
      setTheme(savedTheme);
    }

    const currentTheme = savedTheme || (userHasDarkMode ? "dark" : "light");
    // elements class
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    //body class
    document.body.classList.remove("bg-light", "bg-dark");
    document.body.classList.add(theme === "light" ? "bg-light" : "bg-dark");
  }, [theme]);

  return (
    <>
      <ErrorBoundary>
        <CookiePolicyHOC>
          <AllRoutes />
          <Footer />
        </CookiePolicyHOC>
      </ErrorBoundary>
    </>
  );
}
