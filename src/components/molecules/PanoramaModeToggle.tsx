import React from 'react';
import { Switch } from '@/components/ui/switch';
import { GlassCard } from '@/components/atoms/GlassCard';

interface PanoramaModeToggleProps {
  isPanoramaMode: boolean;
  onToggle: (checked: boolean) => void;
}

/**
 * Toggle for switching between panorama and cubemap modes
 */
export const PanoramaModeToggle: React.FC<PanoramaModeToggleProps> = ({ 
  isPanoramaMode, 
  onToggle 
}) => {
  return (
    <GlassCard className="max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label htmlFor="panorama-mode" className="text-lg font-semibold text-white cursor-pointer">
            Save as Panorama
          </label>
          <p className="text-sm text-blue-200/70 font-light">
            {isPanoramaMode 
              ? 'Saves to textures/ui/ as panorama_*.png' 
              : 'Saves to textures/environment/overworld_cubemap/ as cubemap_*.png'
            }
          </p>
        </div>
        <Switch
          id="panorama-mode"
          checked={isPanoramaMode}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-blue-500"
        />
      </div>
    </GlassCard>
  );
};
