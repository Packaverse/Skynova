import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

/**
 * Dark mode toggle button component
 */
export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="rounded-full p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
    >
      {isDarkMode ? <Sun className="h-4 w-4 text-blue-300" /> : <Moon className="h-4 w-4 text-blue-600" />}
    </Button>
  );
};
