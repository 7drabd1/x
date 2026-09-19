import { useEffect, useState } from 'react';

function read<T>(key: string, initial: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initial;
    const parsed = JSON.parse(raw) as T;
    // Merge with defaults so fields added in later versions never come back undefined.
    if (initial && typeof initial === 'object' && !Array.isArray(initial) && parsed && typeof parsed === 'object') {
      return { ...initial, ...parsed };
    }
    return parsed;
  } catch {
    return initial; // storage blocked or corrupted: start fresh
  }
}

/**
 * useState that survives reloads. Data stays on the visitor's device only:
 * no server, no account, no tracking.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode or quota exceeded: the app keeps working in memory */
    }
  }, [key, value]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setValue(JSON.parse(e.newValue) as T);
      } catch {
        /* ignore malformed data */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, setValue] as const;
}
