import { useState, useEffect } from "react";
import { useAuth } from "@hooks/useContextHooks";
import DefaultAvatar from "@images/DefaultAvatar.svg";

export default function ProfileNavDisplay() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="text-black dark:text-white">
        <div className="p-2 flex flex-row justify-start">
          <div className="flex">
            <img
              className="inline-flex border-4 border-black dark:border-white rounded-full shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-btnInfo-light/100 dark:shadow-btnInfo-dark/100 bg-navbar-light dark:bg-navbar-dark h-16 w-16"
              src={user.avatar || DefaultAvatar}
            />
            <h1 className="text-xs md:text-xs font-bold mt-6 ml-4">
              @{user.username}
            </h1>
          </div>
        </div>
      </header>
    </>
  );
}
