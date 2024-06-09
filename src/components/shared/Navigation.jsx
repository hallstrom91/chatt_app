import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Open from "@svg/Open.svg?react";
import Cross from "@svg/Cross.svg?react";
import { useAuth } from "@hooks/useAuth";

export default function Navigation() {
  const { user, logout } = useAuth();
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
            {user ? (
              <>
                <li className="my-2">
                  <Link to onClick={handleToggle}>
                    {user.username}
                  </Link>
                </li>
                <li className="my-2">
                  <Link to onClick={handleToggle}>
                    Chatt
                  </Link>
                </li>
                <li className="my-2">
                  <button
                    onClick={logout}
                    className="px-2 py-1 border-2 rounded tracking-tight font-semibold bg-button-light border-lines-light dark:bg-button-dark dark:border-lines-dark"
                  >
                    Logga ut
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="my-2">
                  <Link to="/" onClick={handleToggle}>
                    Login
                  </Link>
                </li>
                <li className="my-2">
                  <Link to="/register" onClick={handleToggle}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
