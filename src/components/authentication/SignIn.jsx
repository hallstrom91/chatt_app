import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useContextHooks";
import SignInLock from "@svg/SignInLock.svg?react";

export default function SignIn() {
  const { login, logout, fetchCrsfToken, isAuthenticated, jwtToken } =
    useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(userData.username, userData.password);
      console.info("login success");
      navigate("/profile", { replace: true });
    } catch (error) {
      setError("Inloggning misslyckad.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      <section className="border rounded-lg bg-container-light dark:bg-container-dark  text-black dark:text-white border-black/20 dark:border-white/20">
        <div className="mb-10 flex-row justify-center items-center align-middle">
          <div className="py-8 flex justify-center items-center align-middle">
            <h1 className="text-3xl text-center tracking-tight font-bold">
              Login
            </h1>
            <SignInLock className="icon ml-2" height={35} />
          </div>
          <div className="grid justify-items-center px-5">
            <div className="px-4 mb-3">
              <label
                htmlFor="login-username"
                className="tracking-tighter font-semibold hidden"
              >
                Användarnamn:
              </label>
              <input
                type="text"
                name="username"
                id="login-username"
                autoComplete="username"
                placeholder="Användarnamn"
                value={userData.username}
                onChange={handleChange}
                className="rounded block px-2 py-1 tracking-tight text-black placeholder-neutral-500 "
              />
            </div>
            <div className="px-4 mb-3 justify-center">
              <label
                htmlFor="login-password"
                className="tracking-tighter font-semibold hidden"
              >
                Lösenord:
              </label>
              <input
                type="password"
                name="password"
                id="login-password"
                autoComplete="password"
                placeholder="Lösenord"
                value={userData.password}
                onChange={handleChange}
                className="rounded block px-2 py-1 tracking-tight text-black placeholder-neutral-500 "
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Link to={"/register"} className="text-xs justify-start ml-10">
              Inte medlem?
            </Link>
            <Link className="text-xs justify-end mr-10">Glömt lösenord?</Link>
          </div>
          <div className="grid justify-end mr-10 mt-4">
            <button
              onClick={handleSubmit}
              className="px-2 py-1 mt-2 text-sm border border-black rounded text-white bg-btnLogin-light dark:bg-btnLogin-dark tracking-tight"
            >
              Skicka
            </button>
          </div>
        </div>
        {error && (
          <p className="text-font-light dark:text-font-dark text-center">
            {error}
          </p>
        )}
      </section>
    </>
  );
}
