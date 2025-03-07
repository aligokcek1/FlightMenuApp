import { createWorker } from 'tesseract.js';

export class ImagePreprocessor {
  /**
   * Enhance image contrast for better OCR
   * @param imageFile - Original image file
   * @returns Preprocessed image as File
   */
  static async enhanceContrast(imageFile: File): Promise<File> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not supported');
    }

    const img = await this.loadImage(imageFile);
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Enhanced contrast and sharpening for better text recognition
    const factor = 1.2; // Reduced contrast factor for Turkish characters
    const threshold = 128;
    
    for (let i = 0; i < data.length; i += 4) {
      // Enhanced algorithm for Turkish character recognition
      for (let j = 0; j < 3; j++) {
        const value = data[i + j];
        // Adaptive thresholding for better diacritic mark detection
        if (Math.abs(value - threshold) < 30) {
          // Preserve middle-range values for diacritics
          data[i + j] = value;
        } else {
          // Apply contrast enhancement
          data[i + j] = this.truncateColor(factor * (value - threshold) + threshold);
        }
      }
    }

    // Put enhanced image data back
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to file
    return this.canvasToFile(canvas, imageFile.name);
  }

  /**
   * Remove background noise
   * @param imageFile - Original image file
   * @returns Preprocessed image as File
   */
  static async removeNoise(imageFile: File): Promise<File> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not supported');
    }

    const img = await this.loadImage(imageFile);
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple noise reduction
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i+1] + data[i+2]) / 3;
      
      // Remove very light or very dark pixels
      if (avg < 30 || avg > 225) {
        data[i] = data[i+1] = data[i+2] = 255; // White out
      }
    }

    ctx.putImageData(imageData, 0, 0);

    return this.canvasToFile(canvas, imageFile.name);
  }

  /**
   * Load image from file
   * @param file - Image file
   * @returns Promise resolving to HTMLImageElement
   */
  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert canvas to file
   * @param canvas - Canvas element
   * @param filename - Output filename
   * @returns File object
   */
  private static canvasToFile(canvas: HTMLCanvasElement, filename: string): File {
    return new File(
      [this.dataURItoBlob(canvas.toDataURL('image/png'))], 
      filename, 
      { type: 'image/png' }
    );
  }

  /**
   * Convert data URI to Blob
   * @param dataURI - Data URI string
   * @returns Blob object
   */
  private static dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  /**
   * Truncate color value to valid range
   * @param value - Color value to truncate
   * @returns Truncated color value
   */
  private static truncateColor(value: number): number {
    return Math.max(0, Math.min(255, value));
  }
}