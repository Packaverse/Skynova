import React from 'react';
import { DarkModeToggle } from './DarkModeToggle';

interface AppHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

/**
 * Application header with title and dark mode toggle
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
      </div>
      
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
        Skynova
      </h1>
      <p className="text-xl text-blue-100/80 dark:text-blue-200/70 max-w-2xl mx-auto font-light">
        Convert any panoramic HDRI image into a Minecraft Bedrock Edition sky cubemap texture pack in seconds.
      </p>
    </div>
  );
};
