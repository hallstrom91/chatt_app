import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Cookies.get("theme") || "light");

  // move & fix
  useEffect(() => {
    Cookies.set("theme", theme, { expires: 365 });
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    //body
    document.body.classList.remove("bg-light", "bg-dark");
    document.body.classList.add(theme === "light" ? "bg-light" : "bg-dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;
