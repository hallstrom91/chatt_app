import { useState, useCallback } from "react";

const useSessionStorage = (key, initialValue) => {
  // get init value from sessionStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading sessionStorage key", key, error);
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
        console.error("Error setting sessionStorage key", error);
      }
    },
    [key, storedValue] // recreate ONLY if key / value changes
  );
  return [storedValue, setValue];
};

export default useSessionStorage;
