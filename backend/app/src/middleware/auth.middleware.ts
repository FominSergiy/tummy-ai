import { FastifyReply, FastifyRequest } from 'fastify';
import { jwtService } from '../services/index.js';

export interface JwtPayload {
  userId: number;
  email: string;
  timestamp: number;
  iat: number;
  exp: number;
  iss: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload;
  }
}

/**
 * Authentication middleware that extracts and validates JWT token
 * Use as preHandler hook on protected routes
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.code(401).send({ error: 'Authorization header required' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return reply
      .code(401)
      .send({ error: 'Invalid authorization format. Use: Bearer <token>' });
  }

  try {
    const decoded = jwtService.verifyToken(token) as JwtPayload;

    if (!decoded) {
      return reply.code(401).send({ error: 'Invalid token' });
    }

    request.user = decoded;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Token verification failed';
    return reply.code(401).send({ error: message });
  }
}
