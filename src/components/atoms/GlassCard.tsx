import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable glassmorphism card component
 */
export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
  return (
    <Card className={`bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-blue-500/30 shadow-2xl shadow-blue-500/10 ${className}`}>
      <CardContent className="p-8">
        {children}
      </CardContent>
    </Card>
  );
};
