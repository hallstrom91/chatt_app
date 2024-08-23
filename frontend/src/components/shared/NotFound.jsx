import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import Cookies from "js-cookie";
export default function NotFound() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // change to authUtils - checkToken
  const isTokenValid = () => {
    const token = Cookies.get("token");
    return token !== undefined;
  };

  // if JWT is valid, send user to profile , if not, to login
  const handleClick = () => {
    if (isTokenValid()) {
      navigate("/profile");
    } else {
      logout();
      navigate("/");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-black dark:text-white">
          <h1 className="text-2xl lg:text-4xl font-semibold">
            404 - Sidan kunde inte hittas.
          </h1>
          <p className="text-base">
            Beklagar men sidan du försöker hämta existerar inte.
          </p>
          <p className="text-xs pb-2">Sidan kan vara under konstruktion.</p>
          <button
            onClick={handleClick}
            className="px-2 py-1 border text-black border-black rounded bg-btnNeutral-light dark:bg-btnNeutral-dark"
          >
            Tillbaka Hem
          </button>
        </div>
      </div>
    </>
  );
}
