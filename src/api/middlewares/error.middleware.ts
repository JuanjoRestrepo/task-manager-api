import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors';

export const errorHandler = (
  err: any,
  req: any,
  res: Response,
  _next: NextFunction,
) => {
  const requestId = req.id;
  const isProd = process.env.NODE_ENV === 'production';

  // Log estructurado
  if (req.log) {
    req.log.error(
      {
        err,
        requestId,
        path: req.url,
        method: req.method,
      },
      'Request error',
    );
  }

  // Error controlado (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      requestId,
      ...(isProd ? {} : { stack: err.stack }),
    });
  }

  // Error no controlado
  return res.status(500).json({
    message: isProd ? 'Internal server error' : err.message,
    requestId,
    ...(isProd ? {} : { stack: err.stack }),
  });
};
