import pino from 'pino';

const prettyLogs = process.env.LOG_FORMAT !== 'json';

export const logger = pino(
  prettyLogs
    ? {
        level: process.env.LOG_LEVEL ?? 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss',
          },
        },
      }
    : {
        level: process.env.LOG_LEVEL ?? 'info',
      },
);
