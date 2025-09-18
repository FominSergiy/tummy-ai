import { prisma } from '@/backend/prisma/client';
import { hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';

type TBody = { email: string; password: string };
type TResponse = {
  201: { success: boolean };
  409: { error: string };
};

const hashPassword = async (plainPassword: string) => {
  const saltRounds = 6;
  return await hash(plainPassword, saltRounds);
};

export const signUpRoute = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: TBody; Response: TResponse }>(
    '/signup',
    {
      preValidation: (request, response, done) => {
        if (!request.body?.email || !request.body?.password) {
          response
            .code(400)
            .send({ error: 'body should include email and password' });
        }
        done();
      },
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
