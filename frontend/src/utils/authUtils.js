import { jwtDecode } from "jwt-decode";

// auth controller function - protectedRoute
export const checkToken = (user, token, onAuthFail) => {
  // if isAuthenticated session value is missing or false - logout
  const sessionAuth = sessionStorage.getItem("isAuthenticated");
  if (sessionAuth === null || sessionAuth === "false") {
    console.log("IsAuth missing or false");
    onAuthFail();
    return;
  }

  // if token is missing, logout and redirect
  if (!token) {
    console.log("check token - token missing");
    onAuthFail();
    return; // stop function
  }

  // decode token get current time
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  // if token is expired - logout
  if (decodedToken.exp < currentTime) {
    console.log("check token - expired token");
    onAuthFail();
    return; // stop function
  }

  // control values of decoded jwt vs saved user info by context-api
  if (
    !user ||
    user.id !== decodedToken.id ||
    user.username !== decodedToken.user
  ) {
    console.log("check token - user does not match jwt-user");
    onAuthFail();
    return; // stop function
  }
};

// translate API response for register
export const translateError = (errorMessage) => {
  switch (errorMessage) {
    case "Username or email already exists":
      return "Användarnamn eller e-postadress finns redan.";
    case "Username, password, or email is missing or contains only whitespace":
      return "Användarnamn, lösenord eller e-postadress saknas.";
    case "User registered successfully":
      return "Konto skapat.";
    default:
      return "Ett oväntat fel har inträffat, var vänlig försök igen.";
  }
};
// validate email for register
export const validateEmail = (email) => {
  // basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
// validate password for register
export const validatePassword = (password) => {
  // minimum 6 characters, contain min one number and one special character.
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  return passwordRegex.test(password);
};
