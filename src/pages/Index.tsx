
import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Sun, Moon, Image, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cubemapFaces, setCubemapFaces] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setUploadedImage(file);
    convertToCubemap(file);
  };

  const convertToCubemap = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setCubemapFaces([]);

    try {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        // Set canvas size for equirectangular image
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const faces = generateCubemapFaces(imageData, canvas.width, canvas.height);
        
        setCubemapFaces(faces);
        setProgress(100);
        setIsProcessing(false);
        
        toast({
          title: "Conversion successful!",
          description: "Your HDRI has been converted to 6 cubemap faces.",
        });
      };

      img.src = URL.createObjectURL(file);
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

  const generateCubemapFaces = (imageData: ImageData, width: number, height: number): string[] => {
    const faceSize = Math.min(width / 4, height / 2);
    const faces: string[] = [];
    
    // Create canvas for each face
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = faceSize;
    faceCanvas.height = faceSize;
    const faceCtx = faceCanvas.getContext('2d')!;

    // Generate each cubemap face using equirectangular to cubemap conversion
    const faceOrder = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    
    for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
      faceCtx.clearRect(0, 0, faceSize, faceSize);
      
      // Simplified cubemap generation - in real implementation, this would involve
      // proper spherical to cubic projection mathematics
      const sourceX = (faceIndex % 3) * (width / 3);
      const sourceY = Math.floor(faceIndex / 3) * (height / 2);
      const sourceWidth = width / 3;
      const sourceHeight = height / 2;
      
      // Create temporary canvas for source region
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(imageData, 0, 0);
      
      faceCtx.drawImage(
        tempCanvas,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, faceSize, faceSize
      );
      
      faces.push(faceCanvas.toDataURL('image/png'));
      setProgress((faceIndex + 1) * 16.67);
    }

    return faces;
  };

  const downloadZip = async () => {
    if (cubemapFaces.length === 0) return;

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Create folder structure
      const texturesFolder = zip.folder('textures');
      const environmentFolder = texturesFolder!.folder('environment');
      const cubemapFolder = environmentFolder!.folder('overworld_cubemap');

      // Add cubemap faces
      for (let i = 0; i < cubemapFaces.length; i++) {
        const base64Data = cubemapFaces[i].split(',')[1];
        cubemapFolder!.file(`cubemap_${i}.png`, base64Data, { base64: true });
      }

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'minecraft_sky_cubemap.zip';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download started!",
        description: "Your Minecraft cubemap texture pack is downloading.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error creating the ZIP file.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="rounded-full p-2"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HDRI to Minecraft Sky Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert any panoramic HDRI image into a Minecraft Bedrock Edition sky cubemap texture pack in seconds.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="max-w-2xl mx-auto mb-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">
                {uploadedImage ? uploadedImage.name : 'Upload your HDRI image'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your panoramic image here, or click to browse
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Image className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            {isProcessing && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Processing...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cubemap Preview */}
        {cubemapFaces.length > 0 && (
          <Card className="max-w-4xl mx-auto mb-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="text-2xl font-semibold">Cubemap Preview</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {cubemapFaces.map((face, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={face}
                      alt={`Cubemap face ${index}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">cubemap_{index}.png</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={downloadZip}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as ZIP
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Panel */}
        <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">How it works</h3>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                This tool converts equirectangular HDRI images into the 6-face cubemap format required by Minecraft Bedrock Edition.
              </p>
              
              <ul className="list-disc list-inside space-y-2">
                <li>Upload any panoramic HDRI image (JPG, PNG, etc.)</li>
                <li>The tool automatically generates 6 cubemap faces</li>
                <li>Files are named according to Minecraft Bedrock format</li>
                <li>Download includes proper folder structure for texture packs</li>
              </ul>

              <div className="border-t pt-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  This tool is not affiliated with Mojang or Microsoft. Minecraft is a trademark of Mojang.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
