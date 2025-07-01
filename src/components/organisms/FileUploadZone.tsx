import React, { useRef } from 'react';
import { Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/atoms/GlassCard';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

interface FileUploadZoneProps {
  uploadedImage: File | null;
  isProcessing: boolean;
  progress: number;
  onFileSelect: (file: File) => void;
}

/**
 * File upload zone with drag and drop functionality
 */
export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  uploadedImage,
  isProcessing,
  progress,
  onFileSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { dragActive, handleDrag, handleDrop } = useDragAndDrop(onFileSelect);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <GlassCard className="max-w-2xl mx-auto mb-8">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 backdrop-blur-sm ${
          dragActive
            ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/25'
            : 'border-blue-300/50 dark:border-blue-500/50 hover:border-blue-400/80 hover:bg-blue-500/10'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-16 w-16 mx-auto mb-4 text-blue-300" />
        <h3 className="text-xl font-semibold mb-2 text-white">
          {uploadedImage ? uploadedImage.name : 'Upload your HDRI image'}
        </h3>
        <p className="text-blue-200/70 mb-4 font-light">
          Drag and drop your panoramic image here, or click to browse
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 font-medium"
        >
          <Image className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {isProcessing && <ProgressBar progress={progress} />}
    </GlassCard>
  );
};
