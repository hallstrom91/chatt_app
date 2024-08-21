import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import { checkToken } from "@utils/authUtils";
import { UserProvider } from "@contexts/UserContext";
import { MessageProvider } from "@contexts/MessageContext";
import Cookies from "js-cookie";
import SideNavigation from "@navigation/SideNavigation";
import useSessionStorage from "@hooks/useSessionStorage";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const onAuthFail = () => {
    logout(); // changes state of isAuth to false
    navigate("/", { replace: true });
  };

  useEffect(() => {
    // control status of users jwt with interval
    // at mount
    if (isAuthenticated) {
      const token = Cookies.get("token");
      console.log("protectedRoute checkToken @ mount");
      checkToken(user, token, onAuthFail);
    } else {
      // if trying to access /profile or /chat - send back to login/index
      onAuthFail();
    }

    const interval = setInterval(() => {
      if (isAuthenticated) {
        const token = Cookies.get("token");
        console.log("protectedRoute checkToken @ interval - 15s");
        checkToken(user, token, onAuthFail);
      } else {
        // if user is not authenticated ++ add user to statement?
        console.log("protectedroute interval - authfail");
        onAuthFail();
      }
    }, 10000); // 10s interval
    return () => clearInterval(interval);
  }, []);

  return isAuthenticated ? (
    <UserProvider>
      <MessageProvider>
        <>
          <SideNavigation />
          <Outlet />
        </>
      </MessageProvider>
    </UserProvider>
  ) : null;
};

export default ProtectedRoute;
