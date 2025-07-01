import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

/**
 * Animated progress bar component
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label = "Processing..." }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-200">{label}</span>
        <span className="text-sm text-blue-300/70">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-blue-900/30 rounded-full h-3 backdrop-blur-sm">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/50"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
