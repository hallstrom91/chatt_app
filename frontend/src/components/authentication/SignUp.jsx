import { useState } from "react";
import { useAuth } from "@hooks/useContextHooks";
import { Link, useNavigate } from "react-router-dom";
import {
  translateError,
  validateEmail,
  validatePassword,
} from "@utils/authUtils";
import RandomAvatar from "@shared/RandomAvatar";
import UploadAvatar from "@shared/UploadAvatar";
import {
  DefaultAvatar,
  RegisterClipboard,
  ExclamationMark,
} from "@utils/svgIcons";
import * as Sentry from "@sentry/react";

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

  // random avatar selection
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showRandomAvatars, setShowRandomAvatars] = useState(false);
  const [showUploadAvatar, setShowUploadAvatar] = useState(false);

  const handleShowRandomAvatars = () => {
    setShowRandomAvatars(!showRandomAvatars);
  };

  const handleShowUploadAvatar = () => {
    setShowUploadAvatar(!showUploadAvatar);
  };

  const handleAvatarSelect = (avatar) => {
    if (!avatar) return;
    setSelectedAvatar(avatar);
    setUserData((prevData) => ({
      ...prevData,
      avatar: avatar,
    }));
  };

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
        "Lösenordet måste vara sex tecken långt, innehålla en siffra och ett specialtecken !&#$%^&*"
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
      setUserData({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        avatar: "",
      });
      setSelectedAvatar(null);
      const successTimer = setTimeout(() => {
        setSuccess("");
        navigate("/");
      }, 5000); //7s wait and then redirect
      return () => clearTimeout(successTimer);
    } catch (error) {
      const translatedError = translateError(error.message);
      Sentry.captureException(error);
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
          <form onSubmit={handleSubmit}>
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
                  autoComplete="current-password"
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
              <div className="grid grid-rows-1 relative px-4 mb-3 items-center w-full">
                <p className="text-xs tracking-tight pb-1">
                  Välj en anonym avatar från galleriet.
                </p>
                <button
                  type="button"
                  className="mb-1 px-2 py-1 text-sm rounded bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
                  onClick={handleShowRandomAvatars}
                >
                  Anonym Avatar
                </button>
                <p className="text-center text-sm mx-1 font-semibold">eller</p>
                <button
                  type="button"
                  className="mt-1 px-2 py-1 text-sm rounded bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
                  onClick={handleShowUploadAvatar}
                >
                  Personlig Avatar
                </button>
                <p className="text-xs tracking-tight pt-1">
                  Ladda upp en personlig avatar.
                </p>
              </div>
            </div>
            <div className="grid justify-end mr-10">
              <Link to={"/"} className="text-xs">
                Redan medlem?
              </Link>
            </div>

            <div className="flex justify-start pl-8">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar}
                  alt="user avatar"
                  className="object-cover w-20 h-20 rounded-full border-4 border-container-dark dark:border-container-light"
                />
              ) : (
                <>
                  <img
                    src={DefaultAvatar}
                    alt="default avatar"
                    className="object-cover w-20 h-20 rounded-full border-4 border-container-dark dark:border-container-light"
                  />
                </>
              )}
            </div>
            <div className="flex justify-end mr-10">
              <button
                type="submit"
                className="px-2 py-2 mt-2 text-base rounded text-white bg-btnLogin-light dark:bg-btnLogin-dark"
              >
                Registrera
              </button>
            </div>
          </form>
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
            Innehålla ett specialtecken. - !&#$%^&*
          </p>
        </div>
      </section>

      {/* Avatar test-container */}
      {showRandomAvatars && (
        <>
          <RandomAvatar
            onSelect={handleAvatarSelect}
            onClose={() => setShowRandomAvatars(false)}
          />
        </>
      )}
      {showUploadAvatar && (
        <>
          <UploadAvatar
            onSelect={handleAvatarSelect}
            onClose={() => setShowUploadAvatar(false)}
          />
        </>
      )}
    </>
  );
}
