import React, { useState, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";

export default function UserSecurity() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [updateUser, setUpdateUser] = useState({
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateUser.password !== updateUser.confirmPassword) {
      setError("Lösenorden matchar inte varandra.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <section className="text-font-light border-lines-light dark:text-font-dark dark:border-lines-dark">
        {/*  page text display with bg??*/}
        <div className="w-full bg-neutral-500 rounded-tr-lg">
          <h1 className="lg:text-xl text-lg font-semibold uppercase p-2">
            Säkerhet
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row w-full p-2">
          <div className="flex flex-col w-full lg:w-1/2 pt-5">
            <h2 className="text-base font-semibold">Uppdatera</h2>
            <div className="flex flex-col w-3/4 lg:w-2/3 pt-3">
              <label
                htmlFor="password"
                className="text-sm font-semibold tracking-tight"
              >
                Nytt Lösenord:
              </label>
              <input
                type="password"
                name="password"
                value={updateUser.password}
                onChange={handleInput}
                className="mb-2 p-1 border rounded"
              />
            </div>
            <div className="flex flex-col w-3/4 lg:w-2/3 pt-3">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold tracking-tight"
              >
                Lösenord Igen:
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={updateUser.confirmPassword}
                onChange={handleInput}
                className="mb-2 p-1 border rounded"
              />
            </div>
            <div className="flex flex-col w-3/4 lg:w-2/3 pt-3">
              <label
                htmlFor="email"
                className="text-sm font-semibold tracking-tight"
              >
                Ny Email:
              </label>
              <input
                type="email"
                name="email"
                value={updateUser.email}
                onChange={handleInput}
                className="mb-2 p-1 border rounded"
              />
            </div>

            {error && (
              <p className="text-font-light dark:text-font-dark text-xs">
                {error}
              </p>
            )}
            <div className="flex w-full justify-center pl-10 lg:pl-0 lg:w-2/3 lg:justify-end">
              <button
                onClick={handleSubmit}
                className="px-2 py-1 mt-2 text-sm border border-black rounded"
              >
                Uppdatera
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/2 pt-5">
            <h2 className="text-base font-semibold">DangerZone</h2>
            <p className="text-sm font-semibold py-2">
              Alla val i "Danger Zone" är permanenta.
            </p>
            <div className="border-2 w-72 border-black/30 rounded"></div>

            <div className="pt-4">
              <p className="text-sm">Ta bort ditt konto?</p>
              <button className="px-2 py-1 mt-2 text-sm border bg-red-800 text-white border-black rounded">
                Ta Bort Konto
              </button>
            </div>
            <div className="pt-4">
              <p className="text-sm">Ta bort alla dina meddelanden?</p>
              <button className="px-2 py-1 mt-2 text-sm border bg-red-800 text-white border-black rounded">
                Ta Bort Meddelanden
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
