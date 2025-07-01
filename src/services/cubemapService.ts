/**
 * Converts equirectangular HDRI image to cubemap faces
 */
export class CubemapConverter {
  /**
   * Generates 6 cubemap faces from image data
   */
  static generateCubemapFaces(
    imageData: ImageData, 
    width: number, 
    height: number,
    onProgress?: (progress: number) => void
  ): string[] {
    const faceSize = Math.min(width / 4, height / 2);
    const faces: string[] = [];
    
    // Create canvas for each face
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = faceSize;
    faceCanvas.height = faceSize;
    const faceCtx = faceCanvas.getContext('2d')!;
    
    // Generate each cubemap face using equirectangular to cubemap conversion
    // Updated order: left, front, right, back, top, bottom
    const faceOrder = ['left', 'front', 'right', 'back', 'top', 'bottom'];
    
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
      
      // Report progress
      if (onProgress) {
        onProgress((faceIndex + 1) * 16.67);
      }
    }

    return faces;
  }

  /**
   * Converts a file to cubemap faces
   */
  static async convertFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        try {
          // Set canvas size for equirectangular image
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const faces = this.generateCubemapFaces(imageData, canvas.width, canvas.height, onProgress);
          
          resolve(faces);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }
}
