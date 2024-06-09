import React, { useState } from "react";
import Clipboard from "@svg/Clipboard.svg?react";
import { useAuth } from "@hooks/useAuth";

export default function SignUp() {
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    avatar: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await register(
        userData.username,
        userData.password,
        userData.email,
        userData.avatar
      );
      setSuccess("Registrering lyckad.");
      console.log("API Response - Register:", data);
      setUserData({ username: "", password: "", email: "", avatar: "" });
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("register failed", error.message);
      setError("Registrering misslyckad");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      <section className="border rounded-lg bg-secondary-light border-lines-light text-font-light dark:bg-secondary-dark dark:border-lines-dark dark:text-font-dark">
        <div className="mb-10 flex-row justify-center items-center align-middle">
          <div className="py-8 flex justify-center items-center align-middle">
            <h1 className="text-3xl text-center tracking-tight font-bold">
              Registrera
            </h1>
            <Clipboard className="icon ml-2" height={35} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid justify-items-center px-5"
          >
            <div className="px-4 mb-2">
              <label
                htmlFor="register-username"
                className="tracking-tighter font-semibold"
              >
                Användarnamn:
              </label>
              <input
                type="text"
                name="username"
                id="register-username"
                autoComplete="username"
                placeholder="Username"
                value={userData.username}
                onChange={handleChange}
                className="rounded block px-2 py-1 tracking-tight text-black"
              />
            </div>
            <div className="px-4 mb-2 justify-center">
              <label
                htmlFor="register-password"
                className="tracking-tighter font-semibold"
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
                className="rounded block px-2 py-1 tracking-tight text-black"
              />
            </div>
            <div className="px-4 mb-2 justify-center">
              <label
                htmlFor="register-email"
                className="tracking-tighter font-semibold"
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
                className="rounded block px-2 py-1 tracking-tight text-black"
              />
            </div>
            <div className="px-4 mb-2 justify-center">
              <label
                htmlFor="register-avatar"
                className="tracking-tighter font-semibold"
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
                className="rounded block px-2 py-1 tracking-tight text-black"
              />
            </div>
            <div className="flex justify-end mr-10 mt-4">
              <button
                type="submit"
                className="px-2 py-1 border-2 rounded tracking-tight font-semibold bg-button-light border-lines-light dark:bg-button-dark dark:border-lines-dark"
              >
                Skicka
              </button>
            </div>
          </form>
        </div>
        {error && (
          <p className="text-font-light dark:text-font-dark">{error}</p>
        )}
        {success && (
          <p className="text-font-light dark:text-font-dark">{success}</p>
        )}
      </section>
    </>
  );
}
