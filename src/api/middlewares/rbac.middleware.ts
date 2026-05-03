import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../../utils/errors';
import { Role } from '@prisma/client';

export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return next(new AppError('Unauthorized: Role not found', 401));
    }

    if (!roles.includes(req.userRole as Role)) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }

    next();
  };
};
