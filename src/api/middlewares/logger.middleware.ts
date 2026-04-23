import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { logger } from '../../config/logger';

export const httpLogger = pinoHttp({
  logger,

  genReqId: (req) => {
    const existing = req.headers['x-request-id'];
    return existing || randomUUID();
  },

  customLogLevel: (res, err) => {
    const statusCode = res.statusCode ?? 0;
    if (statusCode >= 500 || err) return 'error';
    if (statusCode >= 400) return 'warn';
    return 'info';
  },

  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
