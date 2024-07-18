import React, { useState, useEffect } from "react";
import { useAuth } from "@hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="border-lines-light text-font-light  dark:border-lines-dark dark:text-font-dark">
        <div className="p-2 flex flex-row justify-start">
          <div className="flex">
            <img
              className="inline-flex  object-scale-fit border-4 rounded-full shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-indigo-600/100 bg-indigo-500 h-16 w-16"
              src={user.avatar}
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
