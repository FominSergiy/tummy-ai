import { FastifyInstance } from 'fastify';

export const pingRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world', timestamp: new Date().toISOString() });
  });
};
