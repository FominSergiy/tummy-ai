import { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import { s3Service } from '../services/s3.service.js';
import { storageConfig } from '../config/storage.config.js';

interface FileKeyParams {
  fileKey: string;
}

interface CommitDeclineBody {
  fileKey: string;
}

export const storageRoutes = async (fastify: FastifyInstance) => {
  // Register multipart plugin for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  });

  /**
   * Upload file to temp storage
   * POST /storage/upload
   */
  fastify.post(storageConfig.endpoints.upload, async (request, reply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ error: 'No file provided' });
      }

      // Convert stream to buffer
      const buffer = await data.toBuffer();

      const result = await s3Service.uploadToTemp({
        buffer,
        mimetype: data.mimetype,
        originalFilename: data.filename,
      });

      return reply.code(201).send({
        success: true,
        data: result,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: 'Failed to upload file',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  /**
   * Retrieve file from storage
   * GET /storage/retrieve/:fileKey
   */
  fastify.get<{ Params: FileKeyParams }>(
    storageConfig.endpoints.retrieve,
    async (request, reply) => {
      try {
        const { fileKey } = request.params;

        // Try to retrieve from permanent storage first, then temp
        let result = await s3Service.retrieve(
          `${storageConfig.folders.permanent}${fileKey}`
        );

        if (!result) {
          result = await s3Service.retrieve(
            `${storageConfig.folders.temp}${fileKey}`
          );
        }

        if (!result) {
          return reply.code(404).send({ error: 'File not found' });
        }

        reply.header('Content-Type', result.contentType);
        reply.header('Content-Length', result.contentLength);
        return reply.send(result.stream);
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: 'Failed to retrieve file',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Check if file exists in storage
   * GET /storage/exists/:fileKey
   */
  fastify.get<{ Params: FileKeyParams }>(
    storageConfig.endpoints.exists,
    async (request, reply) => {
      try {
        const { fileKey } = request.params;

        const existsInPermanent = await s3Service.exists(
          `${storageConfig.folders.permanent}${fileKey}`
        );
        const existsInTemp = await s3Service.exists(
          `${storageConfig.folders.temp}${fileKey}`
        );

        return reply.code(200).send({
          exists: existsInPermanent || existsInTemp,
          location: existsInPermanent
            ? 'permanent'
            : existsInTemp
              ? 'temp'
              : null,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: 'Failed to check file existence',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Commit file - move from temp to permanent storage
   * POST /storage/commit
   */
  fastify.post<{ Body: CommitDeclineBody }>(
    storageConfig.endpoints.commit,
    async (request, reply) => {
      try {
        const { fileKey } = request.body;

        if (!fileKey) {
          return reply.code(400).send({ error: 'fileKey is required' });
        }

        const permanentKey = await s3Service.moveToPermananent(fileKey);

        return reply.code(200).send({
          success: true,
          permanentKey,
          message: 'File committed successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: 'Failed to commit file',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Decline file - delete from temp storage
   * POST /storage/decline
   */
  fastify.post<{ Body: CommitDeclineBody }>(
    storageConfig.endpoints.decline,
    async (request, reply) => {
      try {
        const { fileKey } = request.body;

        if (!fileKey) {
          return reply.code(400).send({ error: 'fileKey is required' });
        }

        await s3Service.deleteFromTemp(fileKey);

        return reply.code(200).send({
          success: true,
          message: 'File declined and deleted from temp storage',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: 'Failed to decline file',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
};
