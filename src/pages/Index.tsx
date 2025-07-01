import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useCubemapConverter } from '@/hooks/useCubemapConverter';
import { PackageService } from '@/services/packageService';
import { GlassmorphismBackground } from '@/components/atoms/GlassmorphismBackground';
import { AppHeader } from '@/components/molecules/AppHeader';
import { PanoramaModeToggle } from '@/components/molecules/PanoramaModeToggle';
import { FileUploadZone } from '@/components/organisms/FileUploadZone';
import { CubemapPreview } from '@/components/organisms/CubemapPreview';
import { InfoPanel } from '@/components/organisms/InfoPanel';

const Index = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isProcessing, progress, cubemapFaces, convertFile } = useCubemapConverter();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isPanoramaMode, setIsPanoramaMode] = useState(false);

  const handleFileSelect = (file: File) => {
    setUploadedImage(file);
    convertFile(file);
  };

  const handleDownload = async () => {
    if (!uploadedImage || cubemapFaces.length === 0) return;

    try {
      await PackageService.downloadTexturePack({
        isPanoramaMode,
        imageName: uploadedImage.name,
        cubemapFaces
      });

      toast({
        title: "✅ Cubemap pack ready!",
        description: "Download your custom sky texture pack.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error creating the texture pack.",
        variant: "destructive"
      });
    }
  };

  return (
    <GlassmorphismBackground isDarkMode={isDarkMode}>
      <AppHeader isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      
      <PanoramaModeToggle 
        isPanoramaMode={isPanoramaMode} 
        onToggle={setIsPanoramaMode} 
      />

      <FileUploadZone
        uploadedImage={uploadedImage}
        isProcessing={isProcessing}
        progress={progress}
        onFileSelect={handleFileSelect}
      />

      <CubemapPreview
        cubemapFaces={cubemapFaces}
        isPanoramaMode={isPanoramaMode}
        uploadedImage={uploadedImage}
        onDownload={handleDownload}
      />

      <InfoPanel />
    </GlassmorphismBackground>
  );
};

export default Index;
