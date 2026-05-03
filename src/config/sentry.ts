import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { env } from './env';

export const initSentry = () => {
  if (env.SENTRY_DSN) {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      integrations: [
        nodeProfilingIntegration(),
      ],
      tracesSampleRate: 1.0, 
      profilesSampleRate: 1.0,
      environment: env.NODE_ENV,
    });
    console.log('✅ Sentry initialized');
  } else {
    console.log('⚠️ Sentry DSN not provided, skipping initialization');
  }
};
