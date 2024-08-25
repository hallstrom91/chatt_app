import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import Cookies from "js-cookie";
import { checkToken } from "@utils/authUtils";

export default function ErrorFallback({ onReset }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // change to authUtils - checkToken
  const isTokenValid = () => {
    const token = Cookies.get("token");
    return token !== undefined;
  };

  // if JWT is valid, send user to profile , if not, to login
  const handleClick = () => {
    onReset();
    if (isTokenValid()) {
      navigate("/profile");
    } else {
      logout();
      navigate("/");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen text-black dark:text-white">
        <div className="text-center">
          <h1 className="text-2xl lg:text-4xl font-semibold">
            Ett fel har inträffat...
          </h1>
          <p className="text-base pb-2">
            Var vänlig och orsaka inte mer problem än nödvändigt, tack.
          </p>
          <button
            onClick={handleClick}
            className="px-2 py-2 border text-black border-black rounded bg-btnNeutral-light dark:bg-btnNeutral-dark"
          >
            Tillbaka Hem
          </button>
        </div>
      </div>
    </>
  );
}
