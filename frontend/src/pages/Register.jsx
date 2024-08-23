import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import SignUp from "@authentication/SignUp";

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
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
