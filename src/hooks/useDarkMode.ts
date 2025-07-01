import { useState, useEffect } from 'react';
import { DarkModeManager } from '@/utils/darkMode';

/**
 * Hook for managing dark mode state
 */
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => DarkModeManager.getInitialMode());

  // Apply dark mode on component mount
  useEffect(() => {
    DarkModeManager.applyMode(isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = DarkModeManager.toggleMode(isDarkMode);
    setIsDarkMode(newMode);
  };

  return {
    isDarkMode,
    toggleDarkMode
  };
};
