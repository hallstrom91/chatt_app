import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CookiePolicy from "@shared/CookiePolicy";

export default function CookiePolicyHOC({ children }) {
  const [showCookiePolicy, setShowCookiePolicy] = useState(false);

  useEffect(() => {
    const accepted = Cookies.get("CookiePolicy") === "accepted";
    const declined = Cookies.get("CookiePolicy") === "declined";

    if (!accepted && !declined) {
      setShowCookiePolicy(true);
    }
  }, []);

  return (
    <>
      {showCookiePolicy && <CookiePolicy />}
      {children}
    </>
  );
}
