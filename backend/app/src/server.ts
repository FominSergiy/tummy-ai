import Fastify from 'fastify';
import { loginRoute, pingRoutes, signUpRoute } from './routes';

const fastify = Fastify({
  logger: true,
});

// Register route plugins
fastify.register(pingRoutes);
fastify.register(signUpRoute);
fastify.register(loginRoute);

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
export { fastify };
