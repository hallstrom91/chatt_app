import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(Cookies.get("token"));

  useEffect(() => {
    fetchCsrfToken();
  }, []);

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
      const { token, avatar } = data;
      setJwtToken(token);
      Cookies.set("token", token);
      setUser({ username, avatar });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setJwtToken(null);
    setUser(null);
    setCsrfToken(null);
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, jwtToken, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
