import sharp from 'sharp';

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetSizeKB?: number;
}

interface CompressionResult {
  buffer: Buffer;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
  format: string;
}

class ImageCompressionService {
  private readonly DEFAULT_MAX_DIMENSION = 1024;
  private readonly DEFAULT_QUALITY = 80;
  private readonly TARGET_SIZE_KB = 100;

  async compress(
    inputBuffer: Buffer,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const {
      maxWidth = this.DEFAULT_MAX_DIMENSION,
      maxHeight = this.DEFAULT_MAX_DIMENSION,
      quality = this.DEFAULT_QUALITY,
      targetSizeKB = this.TARGET_SIZE_KB,
    } = options;

    const originalSize = inputBuffer.length;

    // Get original metadata
    const metadata = await sharp(inputBuffer).metadata();

    // Calculate resize dimensions while maintaining aspect ratio
    const { width: newWidth, height: newHeight } = this.calculateDimensions(
      metadata.width || 0,
      metadata.height || 0,
      maxWidth,
      maxHeight
    );

    // First pass: resize and compress with target quality
    let compressed = await sharp(inputBuffer)
      .resize(newWidth, newHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    // If still too large, reduce quality iteratively
    let currentQuality = quality;
    while (compressed.length > targetSizeKB * 1024 && currentQuality > 20) {
      currentQuality -= 10;
      compressed = await sharp(inputBuffer)
        .resize(newWidth, newHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: currentQuality, mozjpeg: true })
        .toBuffer();
    }

    const compressedMetadata = await sharp(compressed).metadata();

    return {
      buffer: compressed,
      originalSize,
      compressedSize: compressed.length,
      compressionRatio: originalSize / compressed.length,
      width: compressedMetadata.width || 0,
      height: compressedMetadata.height || 0,
      format: compressedMetadata.format || 'jpeg',
    };
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio),
    };
  }

  isImageTooLarge(buffer: Buffer, maxSizeKB: number = 100): boolean {
    return buffer.length > maxSizeKB * 1024;
  }
}

export const imageCompressionService = new ImageCompressionService();
