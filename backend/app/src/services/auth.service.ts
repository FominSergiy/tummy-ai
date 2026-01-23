import { compare, hash } from 'bcrypt';

const hashPassword = async (plainPassword: string) => {
  const saltRounds = 6;
  return await hash(plainPassword, saltRounds);
};

const verifyPassword = async (plain: string, hashed: string) => {
  return await compare(plain, hashed);
};

export { hashPassword, verifyPassword };
