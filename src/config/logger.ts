import pino, { type LoggerOptions } from 'pino';

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const enablePretty =
  !isProd &&
  !isTest &&
  process.stdout.isTTY &&
  process.env.LOG_PRETTY !== 'false';

const options: LoggerOptions = {
  level: isProd ? 'info' : 'debug',
};

if (enablePretty) {
  options.transport = {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' },
  };
}

export const logger = pino(options);
