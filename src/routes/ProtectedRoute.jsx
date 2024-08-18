import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import { checkToken } from "@utils/authUtils";
import Cookies from "js-cookie";
import SideNavigation from "@navigation/SideNavigation";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, setIsAuthenticated } = useAuth();

  const onAuthFail = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", JSON.stringify(false)); //
    logout();
    navigate("/", { replace: true });
  };

  const onAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
  };

  useEffect(() => {
    // control status of users jwt with interval

    // at mount
    if (user) {
      const token = Cookies.get("token");
      console.log("protectedRoute checkToken @ mount");
      checkToken(user, token, onAuthFail, onAuthSuccess);
    } else {
      // if trying to access /profile or /chat - send back to login/index
      onAuthFail();
    }

    const interval = setInterval(() => {
      if (user) {
        const token = Cookies.get("token");
        console.log("protectedRoute checkToken @ interval - 15s");
        checkToken(user, token, onAuthFail, onAuthSuccess);
      } else {
        // if user is not authenticated ++ add user to statement?
        console.log("protectedroute interval - authfail");
        onAuthFail();
      }
    }, 10000); // 10s interval
    return () => clearInterval(interval);
  }, []);

  return (
    isAuthenticated && (
      <>
        <SideNavigation />
        <Outlet />
      </>
    )
  );
};

export default ProtectedRoute;
