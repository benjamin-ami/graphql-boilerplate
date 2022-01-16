import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

import { verifyToken } from '../utils/jwt';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
    {
      emit: 'stdout',
      level: 'error',
    }
  ]
});

prisma.$use(async (params, next) => {
    if (
      params.args.data?.password &&
      params.model === 'User' &&
      params.action === 'create'
    )
        params.args.data.password =
          hashSync(params.args.data.password, +process.env.SALT);
    
    const result = await next(params);
    return result;
});

export default async ({ req }) => {
  const token = req.headers?.authorization || '';
  const user = await verifyToken(token);
  return { prisma, user };
};
