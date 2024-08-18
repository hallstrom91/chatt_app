import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import SignIn from "@authentication/SignIn";

export default function Login() {
  const { isAuthenticated, fetchCsrfToken } = useAuth();
  const navigate = useNavigate();

  const getCSRF = async () => {
    await fetchCsrfToken();
    console.log("fetchCsrfToken @ login");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
      console.log("You have been redirected by Login page.");
    } else {
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
