import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './api/routes/auth.routes';
import testRoutes from './api/routes/test.routes';
import taskRoutes from './api/routes/task.routes';

import { errorHandler } from './api/middlewares/error.middleware';
import { httpLogger } from './api/middlewares/logger.middleware';
import { swaggerSpec } from './config/swagger';

const app = express();

// Logging
app.use(httpLogger);

// Security
app.use(helmet());

// Rate limit global
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      message: 'Too many requests, please try again later.',
    },
  }),
);

// Body parser
app.use(express.json());

// Rate limit login (más restrictivo)
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

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (SIEMPRE AL FINAL)
app.use(errorHandler);

export default app;
