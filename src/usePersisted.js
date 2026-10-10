import { useState, useEffect } from 'react';

// useState that survives a page refresh by mirroring the value into localStorage.
export default function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initial : JSON.parse(saved);
    } catch {
      return initial; // storage blocked (private mode) or corrupted JSON
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage blocked or full: the app still works, it just won't remember
    }
  }, [key, value]);

  return [value, setValue];
}
