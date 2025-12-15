import Fastify from 'fastify';
import { loginRoute, pingRoutes, signUpRoute } from './routes/index.js';

const fastify = Fastify({
  logger: true,
});

// Add CORS headers manually
fastify.addHook('preHandler', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    reply.status(204).send();
  }
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    // Register route plugins
    await fastify.register(pingRoutes);
    await fastify.register(signUpRoute);
    await fastify.register(loginRoute);

    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
export { fastify };
