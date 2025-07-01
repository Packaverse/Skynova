import React from 'react';
import { Info } from 'lucide-react';
import { GlassCard } from '@/components/atoms/GlassCard';

/**
 * Information panel explaining how the tool works
 */
export const InfoPanel: React.FC = () => {
  return (
    <GlassCard className="max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <Info className="h-6 w-6 text-blue-400 mr-2" />
        <h3 className="text-xl font-semibold text-white">How it works</h3>
      </div>
      
      <div className="space-y-4 text-blue-200/80">
        <p className="font-light">
          This tool converts equirectangular HDRI images into the 6-face cubemap format required by Minecraft Bedrock Edition.
        </p>
        
        <ul className="list-disc list-inside space-y-2 font-light">
          <li>Upload any panoramic HDRI image (JPG, PNG, etc.)</li>
          <li>The tool automatically generates 6 cubemap faces</li>
          <li>Choose between Sky (cubemap) or Panorama mode</li>
          <li>Files are named according to Minecraft Bedrock format</li>
          <li>Includes manifest.json and pack_icon.png for easy installation</li>
          <li>Download as .mcpack file ready for Minecraft</li>
        </ul>

        <div className="border-t border-blue-500/20 pt-4 mt-6">
          <p className="text-sm text-blue-300/60 font-light">
            This tool is not affiliated with Mojang or Microsoft. Minecraft is a trademark of Mojang.
          </p>
        </div>
      </div>
    </GlassCard>
  );
};
