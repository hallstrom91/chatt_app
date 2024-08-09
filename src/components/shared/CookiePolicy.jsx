import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export default function CookiePolicy() {
  const [accepted, setAccepted] = useState(false);
  const [showPolicy, setShowPolicy] = useState(!Cookies.get("CookiePolicy"));

  // accept cookie consent request
  const acceptCookies = () => {
    Cookies.set("CookiePolicy", "accepted", { expires: 365 });
    setAccepted(true);
    setShowPolicy(false);
  };

  // decline cookie consent request
  const declineCookies = () => {
    Cookies.set("CookiePolicy", "declined", { expires: 7 });
    setAccepted(false);
    setShowPolicy(false);
  };

  if (!showPolicy || accepted) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full z-50 flex items-baseline justify-center flex-wrap bg-white text-black border-t-2 text-sm p-2">
        <div className="flex-1 flex-shrink-0 w-full md:w-auto mx-5 my-3 sm:my-0">
          <span className="text-xs md:text-base">
            Vi använder Cookies för att förbättra din upplevelsen här på sidan.{" "}
          </span>
        </div>
        <div className="p-2">
          <button
            onClick={declineCookies}
            className="mr-2 px-4 py-2 bg-btnDelete-light dark:bg-btnDelete-dark text-white rounded text-sm"
          >
            Avböj
          </button>
          <button
            onClick={acceptCookies}
            className="mr-2 px-4 py-2 bg-btnPrimary-light dark:bg-btnPrimary-dark text-white rounded text-sm"
          >
            Acceptera
          </button>
        </div>
      </div>
    </>
  );
}
