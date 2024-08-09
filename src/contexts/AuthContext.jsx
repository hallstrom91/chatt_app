import { createContext, useContext, useEffect, useState } from "react";
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

  // fix
  const AuthController = () => {};

  useEffect(() => {
    // at mount
    if (!jwtToken && isTokenExpired(jwtToken)) {
      console.log("jwt-controller mount");
      logout();
    }

    //interval
    const interval = setInterval(() => {
      console.log("jwt-controller interval - 60s");
      const token = Cookies.get("token");
      if (!token || isTokenExpired(token)) {
        logout();
      } else {
        setJwtToken(token);
      }
    }, 30000); // 30s
    return () => clearInterval(interval);
  }, [jwtToken]);

  // check if JWT is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

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
    } catch (error) {
      console.error("Error fetching CSRF token", error);
    }
  };

  // img test link - https://i.pravatar.cc/150?img=63
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
      const decodedToken = jwtDecode(token);
      console.log("decodedToken Auth context-api:", decodedToken);
      const userData = {
        id: decodedToken.id,
        username: decodedToken.user,
        avatar: decodedToken.avatar,
        email: decodedToken.email,
      };
      console.log("userData Auth context-api:", userData);
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
    isTokenExpired,
    fetchCsrfToken,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
