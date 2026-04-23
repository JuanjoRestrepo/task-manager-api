import { taskRepository } from '../persistence/repositories/task.repository';
import { AppError } from '../utils/errors';

export const taskService = {
  async create(userId: number, data: any) {
    return taskRepository.create({
      ...data,
      user: { connect: { id: userId } },
    });
  },

  async findAll(userId: number) {
    return taskRepository.findAllByUser(userId);
  },

  async findOne(userId: number, taskId: number) {
    const task = await taskRepository.findById(taskId);

    if (!task || task.userId !== userId) {
      throw new AppError('Task not found', 404);
    }

    return task;
  },

  async update(userId: number, taskId: number, data: any) {
    const task = await this.findOne(userId, taskId);

    return taskRepository.update(task.id, data);
  },

  async delete(userId: number, taskId: number) {
    const task = await this.findOne(userId, taskId);

    return taskRepository.delete(task.id);
  },
};
