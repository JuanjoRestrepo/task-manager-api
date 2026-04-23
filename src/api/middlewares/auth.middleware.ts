import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/errors';
import { env } from '../../config/env';

export interface AuthRequest extends Request {
  userId?: number;
}

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Authorization header missing', 401);
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Invalid authorization format', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Token not provided', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!decoded.userId) {
      throw new AppError('Invalid token payload', 401);
    }

    req.userId = decoded.userId;

    next();
  } catch (_error) {
    next(new AppError('Invalid or expired token', 401));
  }
};
