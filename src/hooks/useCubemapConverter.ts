import { useState } from 'react';
import { CubemapConverter } from '@/services/cubemapService';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for managing cubemap conversion
 */
export const useCubemapConverter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cubemapFaces, setCubemapFaces] = useState<string[]>([]);

  const convertFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setCubemapFaces([]);

    try {
      const faces = await CubemapConverter.convertFile(file, setProgress);
      
      setCubemapFaces(faces);
      setProgress(100);
      setIsProcessing(false);
      
      toast({
        title: "✅ Conversion successful!",
        description: "Your HDRI has been converted to 6 cubemap faces.",
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setIsProcessing(false);
      toast({
        title: "Conversion failed",
        description: "There was an error processing your image.",
        variant: "destructive"
      });
    }
  };

  return {
    isProcessing,
    progress,
    cubemapFaces,
    convertFile
  };
};
