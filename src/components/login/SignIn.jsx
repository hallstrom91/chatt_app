import React, { useState, useEffect } from "react";
import Locked from "@assets/svg/Locked.svg?react";
export default function SignIn() {
  return (
    <>
      <section className="border rounded-lg bg-secondary-light border-lines-light text-font-light dark:bg-secondary-dark dark:border-lines-dark dark:text-font-dark">
        <div className="mb-10 flex-row justify-center items-center align-middle">
          <div className="py-8 flex justify-center items-center align-middle">
            <h1 className="text-3xl text-center tracking-tight font-bold">
              Login
            </h1>
            <Locked className="icon ml-2" height={35} />
          </div>
          <div className="grid justify-items-center px-5">
            <div className="px-4 mb-2">
              <label
                htmlFor="username"
                className="tracking-tighter font-semibold"
              >
                Användarnamn:
              </label>
              <input
                type="text"
                className="rounded block px-2 py-1 tracking-tight"
                id="username"
                autoComplete="user"
                placeholder="Username"
              />
            </div>
            <div className="px-4 mb-2 justify-center">
              <label
                htmlFor="password"
                className="tracking-tighter font-semibold"
              >
                Lösenord:
              </label>
              <input
                type="password"
                className="rounded block px-2 py-1 tracking-tight"
                id="password"
                autoComplete="user"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex justify-end mr-10 mt-4">
            <button className="px-2 py-1 border-2  rounded tracking-tight font-semibold bg-button-light border-lines-light dark:bg-button-dark dark:border-lines-dark">
              Logga in
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
