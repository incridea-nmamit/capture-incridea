import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Only create one instance of PrismaClient in development
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export const db = prisma;
