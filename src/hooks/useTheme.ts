/**
 * Hook for managing the dark / light theme toggle.
 *
 * Reads initial preference from localStorage (falling back to "dark"),
 * and toggles the "dark" class on the <html> element.
 */

import { useState, useCallback, useEffect } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'itsv-theme';

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage unavailable — fall through
  }
  // Default to dark mode
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Sync the class on <html> and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
