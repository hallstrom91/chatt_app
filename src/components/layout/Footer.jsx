import { useState } from "react";
import { useTheme } from "@hooks/useContextHooks";

export default function Footer() {
  const { toggleTheme } = useTheme();
  return (
    <>
      <footer className="bg-navbar-light dark:bg-navbar-dark w-full static bottom-0 py-10 text-black dark:text-white border-t border-black/20 dark:border-white/20">
        <div className="text-center">
          <p className="font-semibold text-base lg:text-lg">Made by KJS</p>
        </div>
        <div className="flex justify-end mr-4">
          <button
            onClick={toggleTheme}
            className="px-2 py-1 mt-2 text-sm border border-black rounded bg-white text-black"
          >
            Tema
          </button>
        </div>
      </footer>
    </>
  );
}
