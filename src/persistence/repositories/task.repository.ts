import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export const taskRepository = {
  async create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({ data });
  },

  async findAllByUser(userId: number) {
    return prisma.task.findMany({
      where: { userId },
    });
  },

  async findById(id: number) {
    return prisma.task.findUnique({
      where: { id },
    });
  },

  async update(id: number, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.task.delete({
      where: { id },
    });
  },
};
