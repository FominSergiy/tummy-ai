import multipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import { s3Service } from '../services/s3.service.js';

const ROOT_ROUTE = 'ingredients';

interface FileKeyParams {
  fileKey: string;
}

interface CommitDeclineBody {
  fileKey: string;
}

export const ingridientRouts = async (fastify: FastifyInstance) => {
  // Register multipart plugin for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  });

  /**
   * Process image and text input
   */
  fastify.post(`/${ROOT_ROUTE}/analyze`, async (request, reply) => {
    // step 1. add image provided to the temp storage
    try {
      const fileData = await request.file();

      if (!fileData) {
        return reply.code(400).send({ error: 'No file provided' });
      }

      // Convert stream to buffer
      const buffer = await fileData.toBuffer();

      const result = await s3Service.uploadToTemp({
        buffer,
        mimetype: fileData.mimetype,
        originalFilename: fileData.filename,
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

    // TODO: add step 2 - input sanitization and llm send out
  });
};
