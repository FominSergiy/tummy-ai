import { FastifyInstance } from 'fastify';
import { prisma } from '../../../prisma/client.js';
import { AnalysisStatus } from '../../../prisma/generated/prisma/index.js';
import { authenticate } from '../middleware/index.js';

const ROOT_ROUTE = 'ingredients';

interface HistoryQuerystring {
  filter?: string;
  cursor?: string;
  limit?: string;
}

export const historyRoutes = async (fastify: FastifyInstance) => {
  /**
   * GET /ingredients/history
   * Paginated list of committed analyses with today/historical filter
   */
  fastify.get<{ Querystring: HistoryQuerystring }>(
    `/${ROOT_ROUTE}/history`,
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const filter =
          request.query.filter === 'historical' ? 'historical' : 'today';
        const cursor = request.query.cursor || undefined;
        const limit = Math.min(
          Math.max(parseInt(request.query.limit || '10') || 10, 1),
          50
        );

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const committedAtCondition =
          filter === 'today'
            ? { gte: todayStart, ...(cursor ? { lt: new Date(cursor) } : {}) }
            : cursor
              ? { lt: new Date(cursor) }
              : undefined;

        const whereClause = {
          userId: request.user.userId,
          status: AnalysisStatus.COMMITTED,
          ...(committedAtCondition
            ? { committedAt: committedAtCondition }
            : {}),
        };

        const analyses = await prisma.ingredientAnalysis.findMany({
          where: whereClause,
          select: {
            id: true,
            mealTitle: true,
            totalCalories: true,
            committedAt: true,
          },
          orderBy: { committedAt: 'desc' },
          take: limit + 1,
        });

        const hasMore = analyses.length > limit;
        const data = hasMore ? analyses.slice(0, limit) : analyses;
        const nextCursor = hasMore
          ? (data[data.length - 1].committedAt?.toISOString() ?? null)
          : null;

        return reply.code(200).send({
          success: true,
          data: data.map((item) => ({
            id: item.id,
            mealTitle: item.mealTitle,
            totalCalories: item.totalCalories
              ? Number(item.totalCalories)
              : null,
            committedAt: item.committedAt?.toISOString() ?? null,
          })),
          pagination: {
            nextCursor,
            hasMore,
          },
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: 'Failed to fetch analysis history',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
};
