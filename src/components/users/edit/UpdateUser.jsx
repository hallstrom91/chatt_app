import React, { useState, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";

export default function UpdateUser() {
  const { user } = useAuth();

  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    avatar: "",
  });

  if (!user) {
    return null;
  }

  return (
    <>
      <section className="p-2 text-font-light border-lines-light  dark:text-font-dark dark:border-lines-dark">
        {/*  page text display */}
        <h1 className="lg:text-xl text-lg font-semibold uppercase">Profil</h1>

        <div className="flex flex-row">
          {/* display current user info */}
          <div className="w-3/4 flex justify-start pt-3">
            <div className="pt-2 w-full">
              <p className="text-sm font-semibold">
                Id:{" "}
                <span className="lg:text-sm text-xs tracking-tight font-normal bg-neutral-600 px-2 rounded-sm">
                  {user.id}
                </span>
              </p>
              <p className="text-sm font-semibold">
                Namn:{" "}
                <span className="lg:text-sm text-xs tracking-tight font-normal bg-neutral-600 px-2 rounded-sm">
                  {user.username}
                </span>
              </p>
              <p className="text-sm font-semibold">
                Avatar:{" "}
                <span className="lg:text-sm text-xs tracking-tight font-normal bg-neutral-600 px-2 rounded-sm">
                  {user.avatar}
                </span>
              </p>
              <div className="w-full mt-2 border-2 border-black/20 rounded"></div>
            </div>
          </div>
          <div className="w-1/4 flex justify-end">
            <div className="flex-col">
              <div className="border-4 border-lines-light dark:border-lines-dark rounded-sm w-20 h-20 lg:w-32 lg:h-32">
                <img
                  className="object-contain border-4 border-double border-black bg-gray-500"
                  src={user.avatar}
                />
              </div>
              <div className="flex justify-end">
                <button className="px-2 py-1 border mt-2 bg-gray-500 text-xs lg:text-sm">
                  Ändra
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-3/4 flex justify-start pb-2">input fields here</div>
        </div>
      </section>
    </>
  );
}

{
  /*         <div className="flex flex-row justify-center lg:justify-start md:flex-col px-2">
  <div className="py-1 px-2">
    <h1 className="text-base lg:text-lg text-center lg:text-start pb-1 font-semibold">
      Inställningar
    </h1>
  </div>

  <div className="mb-1">
    <label
      htmlFor="update-username"
      className="tracking-tighter font-semibold text-sm"
    >
      Användarnamn:
    </label>
    <div className="flex">
      <input
        type="text"
        name="username"
        id="update-username"
        autoComplete="username"
        placeholder="Användarnamn"
        className="rounded block px-2 py-1 tracking-tight text-black placeholder-neutral-500"
      />
      <button className="ml-3 px-2 py-1 border rounded-lg">
        Ändra
      </button>
      <button className="ml-3 px-2 py-1 border rounded-lg">
        Spara
      </button>
    </div>
  </div>
</div> */
}
