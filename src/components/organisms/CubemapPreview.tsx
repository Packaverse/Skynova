import React from 'react';
import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/atoms/GlassCard';
import { CubemapFacePreview } from '@/components/molecules/CubemapFacePreview';
import { PackageService } from '@/services/packageService';

interface CubemapPreviewProps {
  cubemapFaces: string[];
  isPanoramaMode: boolean;
  uploadedImage: File | null;
  onDownload: () => void;
}

/**
 * Preview of generated cubemap faces with download functionality
 */
export const CubemapPreview: React.FC<CubemapPreviewProps> = ({
  cubemapFaces,
  isPanoramaMode,
  uploadedImage,
  onDownload
}) => {
  if (cubemapFaces.length === 0) return null;

  return (
    <GlassCard className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center mb-6">
        <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
        <h3 className="text-2xl font-semibold text-white">
          {isPanoramaMode ? 'Panorama Preview' : 'Cubemap Preview'}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {cubemapFaces.map((face, index) => (
          <CubemapFacePreview
            key={index}
            face={face}
            index={index}
            displayName={PackageService.getDisplayFilename(index, isPanoramaMode)}
            isPanoramaMode={isPanoramaMode}
          />
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={onDownload}
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 font-medium px-8"
        >
          <Download className="h-4 w-4 mr-2" />
          Convert & Download {isPanoramaMode ? 'Panorama' : 'Sky'} Pack
        </Button>
      </div>
    </GlassCard>
  );
};
