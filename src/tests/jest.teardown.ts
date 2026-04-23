import { prisma, pool } from '../persistence/prisma';

export default async function globalTeardown() {
  await prisma.$disconnect();
  await pool.end();
}
