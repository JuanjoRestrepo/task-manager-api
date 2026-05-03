import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import * as Sentry from '@sentry/node';
import { initSentry } from './config/sentry';

initSentry();

import authRoutes from './api/routes/auth.routes';
import testRoutes from './api/routes/test.routes';
import taskRoutes from './api/routes/task.routes';

import { errorHandler } from './api/middlewares/error.middleware';
import { httpLogger } from './api/middlewares/logger.middleware';
import { swaggerSpec } from './config/swagger';

const app = express();

// 1. TRUST REVERSE PROXY (REQUIRED FOR RENDER)
// This ensures rate limits apply to the actual client IP, not Render's Load Balancer IP
app.set('trust proxy', 1);

// Logging & Security
app.use(httpLogger);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 2. HEALTH CHECKS EXEMPT FROM RATE LIMITING
// Define these BEFORE the rate limiter so Render pings don't trigger a 429
app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 3. GLOBAL RATE LIMITING
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      message: 'Too many requests, please try again later.',
    },
  }),
);

// Rate limit login (more restrictive)
app.use(
  '/auth/login',
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
      message: 'Too many login attempts, try again later.',
    },
  }),
);

// Routes
app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/tasks', taskRoutes);

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler (ALWAYS AT THE END)
Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

export default app;
