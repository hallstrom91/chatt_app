import { useState } from "react";
import { useAuth } from "@hooks/useContextHooks";
import { Link, useNavigate } from "react-router-dom";
import {
  translateError,
  validateEmail,
  validatePassword,
} from "@utils/authUtils";
import RegisterClipboard from "@svg/RegisterClipboard.svg?react";
import ExclamationMark from "@svg/ExclamationMark.svg?react";

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    avatar: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.username || !userData.email || !userData.password) {
      setError("Alla fält måste fyllas i.");
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      setError("Lösenorden matchar inte varandra.");
      return;
    }

    if (!validateEmail(userData.email)) {
      setError("Ogiltig e-postadress.");
      return;
    }

    if (!validatePassword(userData.password)) {
      setError(
        "Lösenordet måste vara sex tecken långt, innehålla en siffra och ett specialtecken."
      );
      return;
    }
    try {
      setError(""); // move?
      const data = await register(
        userData.username,
        userData.password,
        userData.email,
        userData.avatar
      );
      setSuccess("Registrering lyckad.");
      console.info("API Response - Register:", data);
      setUserData({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        avatar: "",
      });
      const successTimer = setTimeout(() => {
        setSuccess("");
        navigate("/");
      }, 7000); //7s wait and then redirect
      return () => clearTimeout(successTimer);
    } catch (error) {
      const translatedError = translateError(error.message);
      console.error("register failed", translatedError);
      setError(translatedError);
      const errorTimer = setTimeout(() => {
        setError("");
      }, 7000);
      return () => clearTimeout(errorTimer);
    }
  };

  return (
    <>
      <section className="border rounded-lg bg-container-light dark:bg-container-dark  text-black dark:text-white border-black/20 dark:border-white/20">
        <div className="mb-10 flex-row justify-center items-center align-middle">
          <div className="py-8 flex justify-center items-center align-middle">
            <h1 className="text-3xl text-center tracking-tight font-bold">
              Registrera
            </h1>
            <RegisterClipboard className="icon ml-2" height={35} />
          </div>
          <div className="grid justify-items-center px-5">
            <div className="relative px-4 mb-3 flex items-center">
              <label
                htmlFor="register-username"
                className="tracking-tighter font-semibold hidden"
              >
                Användarnamn:
              </label>
              <input
                type="text"
                name="username"
                id="register-username"
                autoComplete="username"
                placeholder="Användarnamn"
                value={userData.username}
                onChange={handleChange}
                className="rounded block px-2 py-1 tracking-tight text-black placeholder-neutral-500"
              />
              <span className="absolute right-0 top-1 transform translate-y-0 translate-x-3 pr-2">
                {userData.username === "" && error && (
                  <ExclamationMark
                    height={20}
                    className="fill-btnDelete-light"
                  />
                )}
              </span>
            </div>
            <div className="relative px-4 mb-3 flex items-center">
              <label
                htmlFor="register-password"
                className="tracking-tighter font-semibold hidden"
              >
                Lösenord:
              </label>
              <input
                type="password"
                name="password"
                id="register-password"
                autoComplete="new-password"
                placeholder="Lösenord"
                value={userData.password}
                onChange={handleChange}
                className="rounded block px-2 py-1 tracking-tight text-black placeholder-neutral-500"
              />
              <span className="absolute right-0 top-1 transform translate-y-0 translate-x-3 pr-2">
                {userData.password === "" && error && (
                  <ExclamationMark
                    height={20}
                    className="fill-btnDelete-light"
                  />
                )}
              </span>
            </div>
            <div className="px-4 mb-3 justify-center">
              <label
                htmlFor="confirm-password"
                className="tracking-tighter font-semibold hidden"
              >
                Bekräfta Lösenord:
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirm-password"
                autoComplete="new-password"
                placeholder="Bekräfta Lösenord"
                value={userData.confirmPassword}
                onChange={handleChange}
                className="rounded block px-2 py-1 tracking-tight text-black placeholder-neutral-500"
              />
            </div>
            <div className="relative px-4 mb-3 flex items-center">
              <label
                htmlFor="register-email"
                className="tracking-tighter font-semibold hidden"
              >
                Epost:
              </label>
              <input
                type="email"
                name="email"
                id="register-email"
                autoComplete="email"
                placeholder="Epost"
                value={userData.email}
                onChange={handleChange}
                className="rounded block px-2 py-1 tracking-tight text-black placeholder-neutral-500"
              />
              <span className="absolute right-0 top-1 transform translate-y-0 translate-x-3 pr-2">
                {userData.email === "" && error && (
                  <ExclamationMark
                    height={20}
                    className="fill-btnDelete-light"
                  />
                )}
              </span>
            </div>
            <div className="relative px-4 mb-3 flex items-center">
              <label
                htmlFor="register-avatar"
                className="tracking-tighter font-semibold hidden"
              >
                Avatar
              </label>
              <input
                type="text"
                name="avatar"
                id="register-avatar"
                placeholder="Avatar"
                value={userData.avatar}
                onChange={handleChange}
                className="rounded block px-2 py-1 tracking-tight text-black placeholder-neutral-500"
              />
            </div>
          </div>
          <div className="grid justify-end mr-10">
            <Link to={"/"} className="text-xs">
              Redan medlem?
            </Link>
          </div>
          <div className="flex justify-end mr-10 mt-4">
            <button
              onClick={handleSubmit}
              className="px-2 py-1 mt-2 text-sm border border-black rounded text-white bg-btnLogin-light dark:bg-btnLogin-dark tracking-tight"
            >
              Skicka
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm font-bold text-black dark:text-white flex justify-center items-center break-words">
            {error}{" "}
          </p>
        )}
        {success && (
          <p className="text-sm font-bold text-black dark:text-white  flex justify-center items-center">
            {success}
          </p>
        )}
        <div className="justify-start p-2 mt-4">
          <p className="text-xs font-semibold text-black dark:text-white">
            Lösenordet måste innehålla:
          </p>
          <p className="text-xs tracking-tighter">Minst sex tecken.</p>
          <p className="text-xs tracking-tighter">Innehålla en siffra.</p>
          <p className="text-xs tracking-tighter">
            Innehålla ett specialtecken
          </p>
        </div>
      </section>
    </>
  );
}
