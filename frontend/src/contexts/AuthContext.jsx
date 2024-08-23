import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import useLocalStorage from "@hooks/useLocalStorage";
import useSessionStorage from "@hooks/useSessionStorage";
import DOMPurify from "dompurify";
import * as Sentry from "@sentry/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [csrfToken, setCsrfToken] = useState(null);
  const [user, setUser] = useLocalStorage("user", null);
  const [isAuthenticated, setIsAuthenticated] = useSessionStorage(
    "isAuthenticated",
    false
  );
  const [jwtToken, setJwtToken] = useState(() => {
    const token = Cookies.get("token");
    return token || null;
  });

  // check if JWT is expired
  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  // collect csrftoken
  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(`${API_URL}/csrf`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  // register function
  const register = async (username, password, email, avatar) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          avatar,
          csrfToken,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registrering misslyckades.");
      }
      return data;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  // login function
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, csrfToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Inloggning misslyckades.");
      }

      const token = data.token;
      setJwtToken(token);
      Cookies.set("token", token, {
        expires: 1 / 24,
        path: "/",
        sameSite: "Lax",
        /* secure: true, */
      });
      const decodedToken = jwtDecode(token);
      const userData = {
        id: decodedToken.id,
        username: decodedToken.user,
        avatar: decodedToken.avatar,
        email: decodedToken.email,
      };
      setUser(userData);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  // logout and clear values function
  const logout = async () => {
    if (user && user.id) {
      localStorage.removeItem(`${user.id}_unread`);
    }
    setIsAuthenticated(false);
    setJwtToken(null);
    setUser(null);
    setCsrfToken(null);
    Cookies.remove("token");
  };

  const value = {
    user,
    jwtToken,
    isAuthenticated,
    setIsAuthenticated,
    isTokenExpired,
    fetchCsrfToken,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
