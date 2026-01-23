import multipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import { prisma } from '../../../prisma/client.js';
import { AnalysisStatus } from '../../../prisma/generated/prisma/';
import { authenticate } from '../middleware/index.js';
import { imageCompressionService } from '../services/image-compression.service.js';
import { NonFoodImageError } from '../services/llm/llm.interface.js';
import { llmService } from '../services/llm/llm.service.js';
import { s3Service } from '../services/s3.service.js';
import { parseMultipartWithPrompt } from '../utils/route.utils.js';

const ROOT_ROUTE = 'ingredients';

interface CommitBody {
  analysisId: string;
  overrides?: {
    mealTitle?: string;
    mealDescription?: string;
  };
}
interface DeclineBody {
  analysisId: string;
  reason?: string;
}

export const ingridientRouts = async (fastify: FastifyInstance) => {
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max
    },
  });

  /**
   * POST /ingredients/analyze
   * Upload image, compress, analyze with LLM, return results (don't save yet)
   */
  fastify.post(
    `/${ROOT_ROUTE}/analyze`,
    { preHandler: authenticate },
    async (request, reply) => {
      const startTime = Date.now();
      let analysisId: string | null = null;

      try {
        // Step 1: Get file and prompt from multipart request
        const { fileBuffer, fileMimetype, fileFilename, userPrompt } =
          await parseMultipartWithPrompt(request.parts());

        if (!fileBuffer || !fileMimetype || !fileFilename) {
          return reply.code(400).send({ error: 'No file provided' });
        }

        // Validate file type
        if (!fileMimetype.startsWith('image/')) {
          return reply.code(400).send({
            error: 'Invalid file type. Only images are accepted',
          });
        }

        const originalBuffer = fileBuffer;

        // Step 2: Upload original to temp storage
        const uploadResult = await s3Service.uploadToTemp({
          buffer: originalBuffer,
          mimetype: fileMimetype,
          originalFilename: fileFilename,
        });

        // Step 3: Create analysis record with PENDING status
        const userId = request.user.userId;
        const analysis = await prisma.ingredientAnalysis.create({
          data: {
            userId,
            fileKey: uploadResult.fileKey,
            status: AnalysisStatus.PENDING,
          },
        });
        analysisId = analysis.id;

        // Step 4: Compress image for LLM
        fastify.log.info('Compressing image...');
        const compressionResult =
          await imageCompressionService.compress(originalBuffer);

        // Upload compressed version to temp storage
        const compressedUploadResult = await s3Service.uploadToTemp({
          buffer: compressionResult.buffer,
          mimetype: 'image/jpeg',
          originalFilename: `compressed-${fileFilename}`,
        });

        // Update analysis with compressed file key
        await prisma.ingredientAnalysis.update({
          where: { id: analysisId },
          data: {
            compressedFileKey: compressedUploadResult.fileKey,
            status: AnalysisStatus.ANALYZING,
            analyzedAt: new Date(),
          },
        });

        fastify.log.info(
          `Image compressed: ${compressionResult.originalSize} -> ${compressionResult.compressedSize} bytes ` +
            `(${compressionResult.compressionRatio.toFixed(2)}x reduction)`
        );

        // Step 5: Send to LLM for analysis
        const llmResponse = await llmService.analyzeImage({
          imageBuffer: compressionResult.buffer,
          imageMimeType: 'image/jpeg',
          prompt: userPrompt,
        });

        // Step 5.5: Validate that image contains food
        if (!llmResponse.isFood) {
          throw new NonFoodImageError(llmResponse.detectedContent);
        }

        // Step 6: Update analysis with LLM results
        // Extract key nutrition fields for filtering
        const totalCalories = llmResponse.nutritionFacts?.calories || null;
        const totalSugar = llmResponse.nutritionFacts?.totalSugars || null;
        const totalCarbs = llmResponse.nutritionFacts?.totalCarbs || null;
        const totalProtein = llmResponse.nutritionFacts?.protein || null;

        await prisma.ingredientAnalysis.update({
          where: { id: analysisId },
          data: {
            analysisData: llmResponse as any, // Store full response as JSON
            mealTitle: llmResponse.mealTitle,
            mealDescription: llmResponse.mealDescription,
            totalCalories,
            totalSugar,
            totalCarbs,
            totalProtein,
            status: AnalysisStatus.COMPLETED,
          },
        });

        const processingTime = Date.now() - startTime;

        // Step 7: Return results to user for validation
        return reply.code(200).send({
          success: true,
          analysisId: analysisId,
          provider: llmService.getProviderName(),
          processingTimeMs: processingTime,
          compressionStats: {
            originalSize: compressionResult.originalSize,
            compressedSize: compressionResult.compressedSize,
            ratio: compressionResult.compressionRatio,
          },
          analysis: {
            mealTitle: llmResponse.mealTitle,
            mealDescription: llmResponse.mealDescription,
            ingredients: llmResponse.ingredients,
            nutritionFacts: llmResponse.nutritionFacts,
            allergens: llmResponse.allergens,
            healthFlags: llmResponse.healthFlags,
            confidence: llmResponse.confidence,
          },
          message: 'Analysis complete. Review and commit or decline.',
        });
      } catch (error) {
        fastify.log.error(error);

        // Update analysis status to ERROR if we created one
        if (analysisId) {
          await prisma.ingredientAnalysis
            .update({
              where: { id: analysisId },
              data: { status: AnalysisStatus.ERROR },
            })
            .catch((err) =>
              fastify.log.error('Failed to update error status:', err)
            );
        }

        // Handle non-food image error with specific response
        if (error instanceof NonFoodImageError) {
          return reply.code(400).send({
            error: 'Not a food image',
            message: 'The uploaded image does not appear to contain food.',
            detectedContent: error.detectedContent,
          });
        }

        return reply.code(500).send({
          error: 'Analysis failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * POST /ingredients/commit
   * User validates results - save to DB, delete temp images
   */
  fastify.post<{ Body: CommitBody }>(
    `/${ROOT_ROUTE}/commit`,
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { analysisId, overrides } = request.body;

        if (!analysisId) {
          return reply.code(400).send({ error: 'analysisId is required' });
        }

        // Get analysis
        const analysis = await prisma.ingredientAnalysis.findUnique({
          where: { id: analysisId },
        });

        if (!analysis) {
          return reply.code(404).send({ error: 'Analysis not found' });
        }

        if (analysis.status !== AnalysisStatus.COMPLETED) {
          return reply.code(400).send({
            error: `Cannot commit analysis with status: ${analysis.status}`,
          });
        }

        // Update analysis status
        await prisma.ingredientAnalysis.update({
          where: { id: analysisId },
          data: {
            status: AnalysisStatus.COMMITTED,
            committedAt: new Date(),
            mealTitle: overrides?.mealTitle || analysis.mealTitle,
            mealDescription:
              overrides?.mealDescription || analysis.mealDescription,
          },
        });

        // After successful DB commit, delete temp files from S3
        try {
          await s3Service.deleteFromTemp(analysis.fileKey);
          if (analysis.compressedFileKey) {
            await s3Service.deleteFromTemp(analysis.compressedFileKey);
          }
        } catch (s3Error) {
          // Log but don't fail the request - DB data is saved
          fastify.log.error({
            error: s3Error,
            msg: 'Failed to delete temp files',
          });
        }

        return reply.code(200).send({
          success: true,
          analysisId,
          message: 'Analysis committed successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: 'Failed to commit analysis',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * POST /ingredients/decline
   * User rejects results - delete analysis and temp images
   */
  fastify.post<{ Body: DeclineBody }>(
    `/${ROOT_ROUTE}/decline`,
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { analysisId, reason } = request.body;

        if (!analysisId) {
          return reply.code(400).send({ error: 'analysisId is required' });
        }

        // Get analysis to find file keys
        const analysis = await prisma.ingredientAnalysis.findUnique({
          where: { id: analysisId },
        });

        if (!analysis) {
          return reply.code(404).send({ error: 'Analysis not found' });
        }

        // Update status to DECLINED
        await prisma.ingredientAnalysis.update({
          where: { id: analysisId },
          data: { status: AnalysisStatus.DECLINED },
        });

        // Log reason if provided
        if (reason) {
          fastify.log.info(
            `Analysis ${analysisId} declined. Reason: ${reason}`
          );
        }

        // Delete temp files from S3
        try {
          await s3Service.deleteFromTemp(analysis.fileKey);
          if (analysis.compressedFileKey) {
            await s3Service.deleteFromTemp(analysis.compressedFileKey);
          }
        } catch (s3Error) {
          fastify.log.error({
            error: s3Error,
            msg: 'Failed to delete temp files',
          });
        }

        return reply.code(200).send({
          success: true,
          analysisId,
          message: 'Analysis declined and temp files deleted',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: 'Failed to decline analysis',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * GET /ingredients/analysis/:analysisId
   * Retrieve a specific analysis with full data
   */
  fastify.get<{ Params: { analysisId: string } }>(
    `/${ROOT_ROUTE}/analysis/:analysisId`,
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { analysisId } = request.params;
        const analysis = await prisma.ingredientAnalysis.findUnique({
          where: { id: analysisId },
        });

        if (!analysis) {
          return reply.code(404).send({ error: 'Analysis not found' });
        }

        return reply.code(200).send({
          success: true,
          analysis,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: 'Failed to retrieve analysis',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
};
