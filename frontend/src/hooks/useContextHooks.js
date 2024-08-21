import React, { useContext } from "react";
import AuthContext from "@contexts/AuthContext";
import MessageContext from "@contexts/MessageContext";
import ThemeContext from "@contexts/ThemeContext";
import UserContext from "@contexts/UserContext";

// use AuthContext functions / states
export const useAuth = () => {
  return useContext(AuthContext);
};

// use MessagesContext functions / states
export const useMessage = () => {
  return useContext(MessageContext);
};

// use UserContext functions / states
export const useUser = () => {
  return useContext(UserContext);
};

// use ThemeContext
export const useTheme = () => {
  return useContext(ThemeContext);
};
