import React, { useState } from "react";
import { useTheme } from "@contexts/ThemeContext";

export default function Footer() {
  const { toggleTheme } = useTheme();
  return (
    <>
      <footer className="bg-navbar-light dark:bg-navbar-dark w-full bottom-0 fixed py-10 text-font-light dark:text-font-dark">
        <div className="text-center">Footer Content</div>
        <div className="fixed bottom-5 right-4">
          <button
            onClick={toggleTheme}
            className="px-2 py-1 border-2 rounded tracking-tight font-semibold bg-button-light border-lines-light dark:bg-button-dark dark:border-lines-dark"
          >
            Tema
          </button>
        </div>
      </footer>
    </>
  );
}
