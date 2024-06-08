import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Open from "@svg/Open.svg?react";
import Cross from "@svg/Cross.svg?react";

export default function Navigation() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="fixed top-4 right-4 z-50 bg-button-light dark:bg-button-dark p-1 rounded"
      >
        <Open className="icon" height={35} />
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-navbar-light dark:bg-navbar-dark text-font-light dark:text-font-dark w-64 min-h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500`}
      >
        <div className="p-4 border-b border-lines-light dark:border-lines-dark">
          <h1 className="text-2xl uppercase font-bold text-center text-font-light dark:text-font-dark">
            Nav
          </h1>
        </div>
        <nav className="p-4 h-full">
          <ul className="mb-4 text-xl font-semibold">
            <li className="my-2">
              <Link to="/">Login</Link>
            </li>
            <li className="my-2">
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
