import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [themeClass, setThemeClass] = useState('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem('ais-theme');
    setThemeClass(stored === 'light' ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const next = themeClass === 'dark' ? 'light' : 'dark';
    setThemeClass(next);
    window.localStorage.setItem('ais-theme', next);
  };

  return { themeClass, toggleTheme };
}
