import { useEffect } from 'react';
import { useTheme } from './useTheme';

export function useDarkMode() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return theme === 'dark';
}
