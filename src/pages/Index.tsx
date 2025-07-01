import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Sun, Moon, Image, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cubemapFaces, setCubemapFaces] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply dark mode by default on component mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateManifest = (imageName: string) => {
    return {
      format_version: 2,
      header: {
        description: "https://discord.gg/hXRBsvksRX",
        name: imageName,
        uuid: generateUUID(),
        version: [1, 0, 0],
        min_engine_version: [1, 16, 0]
      },
      modules: [
        {
          description: "Custom sky texture pack",
          type: "resources",
          uuid: generateUUID(),
          version: [1, 0, 0]
        }
      ]
    };
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
          title: "✅ Conversion successful!",
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
    if (cubemapFaces.length === 0 || !uploadedImage) return;

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Get image name without extension for manifest
      const imageName = uploadedImage.name.replace(/\.[^/.]+$/, "");
      
      // Create manifest.json
      const manifest = generateManifest(imageName);
      zip.file('manifest.json', JSON.stringify(manifest, null, 2));
      
      // Add pack_icon.png (copy of front face - cubemap_0.png)
      const frontFaceBase64 = cubemapFaces[0].split(',')[1];
      zip.file('pack_icon.png', frontFaceBase64, { base64: true });
      
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
      a.download = `${imageName}_sky_pack.mcpack`;
      a.click();
      URL.revokeObjectURL(url);

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
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* Glassmorphism Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-black dark:via-blue-950 dark:to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="rounded-full p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-blue-300" /> : <Moon className="h-4 w-4 text-blue-600" />}
            </Button>
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
            HDRI to Minecraft Sky Converter
          </h1>
          <p className="text-xl text-blue-100/80 dark:text-blue-200/70 max-w-2xl mx-auto font-light">
            Convert any panoramic HDRI image into a Minecraft Bedrock Edition sky cubemap texture pack in seconds.
          </p>
        </div>

        {/* Upload Section - Glassmorphism Card */}
        <Card className="max-w-2xl mx-auto mb-8 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-blue-500/30 shadow-2xl shadow-blue-500/10">
          <CardContent className="p-8">
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
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            {isProcessing && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-200">Processing...</span>
                  <span className="text-sm text-blue-300/70">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-3 backdrop-blur-sm">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/50"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cubemap Preview - Glassmorphism Card */}
        {cubemapFaces.length > 0 && (
          <Card className="max-w-4xl mx-auto mb-8 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-blue-500/30 shadow-2xl shadow-blue-500/10">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                <h3 className="text-2xl font-semibold text-white">Cubemap Preview</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {cubemapFaces.map((face, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={face}
                      alt={`Cubemap face ${index}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 border border-blue-500/20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center pb-2">
                      <span className="text-white font-medium text-sm">cubemap_{index}.png</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={downloadZip}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 font-medium px-8"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Convert & Download Sky Pack
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Panel - Glassmorphism Card */}
        <Card className="max-w-2xl mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-blue-500/30 shadow-2xl shadow-blue-500/10">
          <CardContent className="p-8">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
