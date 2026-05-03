import { prisma } from '../persistence/prisma';

export default async function globalTeardown() {
  await prisma.$disconnect();
}
