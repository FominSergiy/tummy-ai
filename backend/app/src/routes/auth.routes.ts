import { compare, hash } from 'bcrypt';
import { FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import { prisma } from '../../../prisma/client.js';
import { jwtService } from '../services/index.js';

type TBody = { email: string; password: string };
type TResponse = {
  201: { success: boolean };
  409: { error: string };
};

const hashPassword = async (plainPassword: string) => {
  const saltRounds = 6;
  return await hash(plainPassword, saltRounds);
};

const verifyPassword = async (plain: string, hashed: string) => {
  return await compare(plain, hashed);
};

const validateBody = (
  request: { body: TBody },
  response: { code: (code: number) => { send: (args: object) => void } },
  done: HookHandlerDoneFunction
) => {
  if (!request.body?.email || !request.body?.password) {
    response
      .code(400)
      .send({ error: 'body should include email and password' });
  }
  done();
};

export const signUpRoute = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: TBody; Response: TResponse }>(
    '/signup',
    {
      preValidation: validateBody,
    },
    async (request, response) => {
      const { email, password } = request.body;

      try {
        // user already exists?
        const isExist = await prisma.user.findFirst({
          where: { email: { equals: email } },
        });
        if (isExist) {
          return response.code(409).send({ error: 'user already exists' });
        }

        // otherwise create
        const hash = await hashPassword(password);
        await prisma.user.create({ data: { email: email, password: hash } });

        return response.code(200).send({ success: true });
      } catch (error) {
        // wrap in case prisma itself dies
        // TODO: add logs - this should be saved
        fastify.log.error(error);
        return response.code(500).send('something went wrong!');
      }
    }
  );
};

export const loginRoute = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: TBody; Response: { success: string; jwt: string } }>(
    '/login',
    {
      preValidation: validateBody,
    },
    async (request, response) => {
      const { email, password } = request.body;

      try {
        // user exist?
        const user = await prisma.user.findFirst({
          where: { email: { equals: email } },
        });
        if (!user) {
          return response
            .code(401)
            .send({ error: 'wrong username or password' });
        }

        if (user) {
          // wrong password
          const isPassMatch = await verifyPassword(password, user.password);
          if (!isPassMatch) {
            return response
              .code(401)
              .send({ error: 'wrong username or password' });
          }

          const { id, email } = user;
          // generate
          const jwt = jwtService.generateToken({
            userId: id,
            email,
            timestamp: Date.now(),
          });

          return response.code(200).send({ success: true, jwt });
        }
      } catch (error) {
        // wrap in case prisma itself dies
        // TODO: add logs - this should be saved
        fastify.log.error(error);
        return response.code(500).send('something went wrong!');
      }
    }
  );
};
