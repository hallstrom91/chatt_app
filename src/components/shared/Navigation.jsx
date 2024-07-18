import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import NavOpen from "@svg/NavOpen.svg?react";
import NavClose from "@svg/NavClose.svg?react";
import UserProfile from "@users/UserProfile";

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    handleToggle();
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleToggle}
        className="fixed top-4 right-4 z-50 bg-button-light dark:bg-button-dark p-1 rounded"
      >
        {isOpen ? (
          <NavClose className="icon" height={35} />
        ) : (
          <NavOpen className="icon" height={35} />
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-navbar-light dark:bg-navbar-dark text-font-light dark:text-font-dark w-64 min-h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500`}
      >
        <div className="p-4 border-b border-lines-light dark:border-lines-dark">
          {user ? (
            <UserProfile />
          ) : (
            <h1 className="text-2xl uppercase font-bold text-center text-font-light dark:text-font-dark">
              MENY
            </h1>
          )}
        </div>
        <nav className="p-4 h-full">
          <ul className="mb-4 text-xl font-semibold">
            {user ? (
              <>
                <li className="my-2">
                  <Link to="/app/profile" onClick={handleToggle}>
                    Profil
                  </Link>
                </li>
                <li className="my-2">
                  <Link to="/app/chat" onClick={handleToggle}>
                    Chatt
                  </Link>
                </li>
                <li className="my-2 pt-10 flex justify-end">
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 border-2 text-sm rounded tracking-tight font-semibold bg-button-light border-lines-light dark:bg-button-dark dark:border-lines-dark"
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
