import React from 'react';

interface GlassmorphismBackgroundProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

/**
 * Glassmorphism background with gradient effects
 */
export const GlassmorphismBackground: React.FC<GlassmorphismBackgroundProps> = ({ 
  children, 
  isDarkMode 
}) => {
  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* Glassmorphism Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-black dark:via-blue-950 dark:to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};
