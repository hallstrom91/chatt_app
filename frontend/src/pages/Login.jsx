import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import SignIn from "@authentication/SignIn";

export default function Login() {
  const { isAuthenticated, fetchCsrfToken, logout } = useAuth();
  const navigate = useNavigate();

  const getCSRF = async () => {
    await fetchCsrfToken();
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    } else {
      logout();
      getCSRF();
    }
  }, []);

  return (
    <>
      <main className="w-full h-screen flex flex-col justify-center items-center">
        <div className="m-16 min-w-xl">
          <SignIn />
        </div>
      </main>
    </>
  );
}
