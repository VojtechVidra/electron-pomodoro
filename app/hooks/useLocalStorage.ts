import { useState } from 'react';
import {
  saveToLocalStorage,
  loadFromLocalStorage
} from '../utils/storageUtils';

type HookReturnType<T> = [T, (value: T | ((value: T) => T)) => void];
export const useLocalStorage = <T = any>(
  key: string,
  initialValue: T
): HookReturnType<T> => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Try to load from local storage or set initialValue
    return loadFromLocalStorage(key) || initialValue;
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    // Save to state
    setStoredValue(valueToStore);
    // Save to localStorage
    saveToLocalStorage(key, valueToStore);
  };

  return [storedValue, setValue];
};
