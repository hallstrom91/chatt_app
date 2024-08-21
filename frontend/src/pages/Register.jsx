import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import SignUp from "@authentication/SignUp";

export default function Register() {
  const { isAuthenticated, fetchCsrfToken } = useAuth();
  const navigate = useNavigate();

  const getCSRF = async () => {
    await fetchCsrfToken();
    console.log("fetchCsrfToken @ register");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
      console.log("You have been redirected by Login page.");
    } else {
      getCSRF(); // remove - not needed?
    }
  }, []);

  return (
    <>
      <main className="w-full h-screen flex flex-col justify-center items-center">
        <div className="m-16 min-w-xl">
          <SignUp />
        </div>
      </main>
    </>
  );
}
