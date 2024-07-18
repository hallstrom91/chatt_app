import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [csrfToken, setCsrfToken] = useState(null);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [jwtToken, setJwtToken] = useState(() => {
    const token = Cookies.get("token");
    return token || null;
  });

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    console.log("jwt checker - authcontext - erry minute");
    const interval = setInterval(() => {
      if (jwtToken && isTokenExpired(jwtToken)) {
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [jwtToken]);

  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  /* const [jwtToken, setJwtToken] = useState(Cookies.get("token")); */

  // collect csrftoken
  const fetchCsrfToken = async () => {
    try {
      const response = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCsrfToken(data.csrfToken);
      console.log("csrf-token", data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token", error);
    }
  };

  // simontheking, hejsan123, simon@simon.se , avatar.se
  // simonthepeasent, hejsan123, peasant@hardlife.se, https://i.pravatar.cc/150?img=63
  // register function
  const register = async (username, password, email, avatar) => {
    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
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
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // login function
  const login = async (username, password) => {
    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, csrfToken }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const token = data.token;
      setJwtToken(token);
      Cookies.set("token", token);
      console.log("token jwt", token);
      const decodedToken = jwtDecode(token);
      const userData = {
        id: decodedToken.id,
        username: decodedToken.user,
        avatar: decodedToken.avatar,
        email: decodedToken.email,
      };
      console.log("userdata authcontext", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // logout and clear values function
  const logout = async () => {
    setJwtToken(null);
    setUser(null);
    setCsrfToken(null);
    Cookies.remove("token");
    localStorage.removeItem("user");
    await fetchCsrfToken();
    navigate("/");
  };

  const value = {
    user,
    jwtToken,
    fetchCsrfToken,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
