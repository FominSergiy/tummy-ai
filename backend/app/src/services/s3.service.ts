import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  NotFound,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';
import { storageConfig } from '../config/storage.config.js';

interface UploadOptions {
  buffer: Buffer;
  mimetype: string;
  originalFilename: string;
}

interface UploadResult {
  fileKey: string;
  tempKey: string;
  url: string;
}

interface RetrieveResult {
  stream: Readable;
  contentType: string;
  contentLength: number;
}

class S3Service {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION || 'us-east-1';
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    this.bucketName = process.env.S3_BUCKET_NAME || 'tummy-ai-uploads';

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'S3 configuration missing. Please check your environment variables.'
      );
    }

    this.client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    });
  }

  /**
   * Generate a unique file key based on the original filename
   */
  private generateFileKey(originalFilename: string): string {
    const timestamp = Date.now();
    const uuid = randomUUID();
    const extension = originalFilename.split('.').pop() || '';
    return `${timestamp}-${uuid}${extension ? '.' + extension : ''}`;
  }

  /**
   * Upload a file to temporary storage
   */
  async uploadToTemp(options: UploadOptions): Promise<UploadResult> {
    const { buffer, mimetype, originalFilename } = options;
    const fileKey = this.generateFileKey(originalFilename);
    const tempKey = `${storageConfig.folders.temp}${fileKey}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: tempKey,
      Body: buffer,
      ContentType: mimetype,
      Metadata: {
        originalFilename,
      },
    });

    await this.client.send(command);

    return {
      fileKey,
      tempKey,
      url: `${process.env.S3_ENDPOINT}/${this.bucketName}/${tempKey}`,
    };
  }

  /**
   * Retrieve a file from storage
   */
  async retrieve(key: string): Promise<RetrieveResult | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.client.send(command);

      if (!response.Body) {
        return null;
      }

      return {
        stream: response.Body as Readable,
        contentType: response.ContentType || 'application/octet-stream',
        contentLength: response.ContentLength || 0,
      };
    } catch (error) {
      if (error instanceof NotFound || (error as any).name === 'NotFound') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Check if a file exists in storage
   */
  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      if (error instanceof NotFound || (error as any).name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Move file from temp storage to permanent storage (commit)
   */
  async moveToPermananent(fileKey: string): Promise<string> {
    const tempKey = `${storageConfig.folders.temp}${fileKey}`;
    const permanentKey = `${storageConfig.folders.permanent}${fileKey}`;

    // Check if temp file exists
    const tempExists = await this.exists(tempKey);
    if (!tempExists) {
      throw new Error(`Temp file not found: ${tempKey}`);
    }

    // Copy to permanent storage
    const copyCommand = new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: `${this.bucketName}/${tempKey}`,
      Key: permanentKey,
    });

    await this.client.send(copyCommand);

    // Delete from temp storage
    await this.delete(tempKey);

    return permanentKey;
  }

  /**
   * Delete a file from storage
   */
  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.client.send(command);
  }

  /**
   * Delete file from temp storage (decline)
   */
  async deleteFromTemp(fileKey: string): Promise<void> {
    const tempKey = `${storageConfig.folders.temp}${fileKey}`;
    await this.delete(tempKey);
  }
}

export const s3Service = new S3Service();
