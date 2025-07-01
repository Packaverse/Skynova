import React from 'react';

interface CubemapFacePreviewProps {
  face: string;
  index: number;
  displayName: string;
  isPanoramaMode: boolean;
}

/**
 * Single cubemap face preview component
 */
export const CubemapFacePreview: React.FC<CubemapFacePreviewProps> = ({
  face,
  index,
  displayName,
  isPanoramaMode
}) => {
  return (
    <div className="relative group">
      <img
        src={face}
        alt={`${isPanoramaMode ? 'Panorama' : 'Cubemap'} face ${index}`}
        className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 border border-blue-500/20"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center pb-2">
        <span className="text-white font-medium text-sm text-center px-2">
          {displayName}
        </span>
      </div>
    </div>
  );
};
