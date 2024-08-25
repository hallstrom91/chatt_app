import { useEffect, useState } from "react";
import { useTheme } from "@hooks/useContextHooks";

export default function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <footer className="bg-navbar-light dark:bg-navbar-dark w-full  py-10 text-black dark:text-white border-t border-black/20 dark:border-white/20 mt-auto">
        <div className="text-center">
          <p className="font-semibold text-base lg:text-lg">Made by KJS</p>
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={toggleTheme}
            className="px-2 py-2 text-base border border-black rounded bg-btnNeutral-light dark:bg-btnNeutral-dark  dark:text-black  text-white"
          >
            {theme === "light" ? "Mörkt Tema" : "Ljust Tema"}
          </button>
        </div>
      </footer>
    </>
  );
}
