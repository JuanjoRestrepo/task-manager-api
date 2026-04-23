import { Response, NextFunction } from 'express';
import { AuthRequest } from '../api/middlewares/auth.middleware';
import { taskService } from '../services/task.service';
import { AppError } from '../utils/errors';

export const taskController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError('Unauthorized', 401);

      const task = await taskService.create(req.userId, req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError('Unauthorized', 401);

      const tasks = await taskService.findAll(req.userId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },

  async findOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError('Unauthorized', 401);

      const task = await taskService.findOne(req.userId, Number(req.params.id));

      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError('Unauthorized', 401);

      const task = await taskService.update(
        req.userId,
        Number(req.params.id),
        req.body,
      );

      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) throw new AppError('Unauthorized', 401);

      await taskService.delete(req.userId, Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
