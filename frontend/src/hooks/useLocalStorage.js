import { useState, useCallback } from "react";

const useLocalStorage = (key, initialValue) => {
  // get init value from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key", key, error);
      return initialValue;
    }
  });

  // set value in localStorage
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error setting localStorage key:", key, error);
      }
    },
    [key, storedValue] // recreate ONLY if key / value changes
  );
  return [storedValue, setValue];
};

export default useLocalStorage;
