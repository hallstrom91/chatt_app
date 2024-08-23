import { useState, useCallback } from "react";
import * as Sentry from "@sentry/react";

const useSessionStorage = (key, initialValue) => {
  // get init value from sessionStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      Sentry.captureException(error);
      return initialValue;
    }
  });

  // set value in sessionStorage
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        Sentry.captureException(error);
      }
    },
    [key, storedValue] // recreate ONLY if key / value changes
  );
  return [storedValue, setValue];
};

export default useSessionStorage;
