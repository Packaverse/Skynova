import { generateManifest } from './manifestService';

export interface PackageOptions {
  isPanoramaMode: boolean;
  imageName: string;
  cubemapFaces: string[];
}

/**
 * Service for creating and downloading Minecraft texture packs
 */
export class PackageService {
  /**
   * Creates and downloads a texture pack
   */
  static async downloadTexturePack(options: PackageOptions): Promise<void> {
    const { isPanoramaMode, imageName, cubemapFaces } = options;
    
    if (cubemapFaces.length === 0) {
      throw new Error('No cubemap faces available');
    }

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Get image name without extension for manifest
    const cleanImageName = imageName.replace(/\.[^/.]+$/, "");
    
    // Create manifest.json
    const manifest = generateManifest(cleanImageName);
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    
    // Add pack_icon.png (copy of left face - cubemap_0.png)
    const leftFaceBase64 = cubemapFaces[0].split(',')[1];
    zip.file('pack_icon.png', leftFaceBase64, { base64: true });
    
    // Create folder structure based on mode
    const texturesFolder = zip.folder('textures');
    let targetFolder;
    let filePrefix;
    
    if (isPanoramaMode) {
      targetFolder = texturesFolder!.folder('ui');
      filePrefix = 'panorama';
    } else {
      const environmentFolder = texturesFolder!.folder('environment');
      targetFolder = environmentFolder!.folder('overworld_cubemap');
      filePrefix = 'cubemap';
    }

    // Add cubemap/panorama faces
    for (let i = 0; i < cubemapFaces.length; i++) {
      const base64Data = cubemapFaces[i].split(',')[1];
      targetFolder!.file(`${filePrefix}_${i}.png`, base64Data, { base64: true });
    }

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanImageName}_${isPanoramaMode ? 'panorama' : 'sky'}_pack.mcpack`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Gets display filename for a face
   */
  static getDisplayFilename(index: number, isPanoramaMode: boolean): string {
    const prefix = isPanoramaMode ? 'panorama' : 'cubemap';
    const faceNames = ['left (-x)', 'front (-z)', 'right (+x)', 'back (+z)', 'top (+y)', 'bottom (-y)'];
    return `${prefix}_${index}.png (${faceNames[index]})`;
  }
}
