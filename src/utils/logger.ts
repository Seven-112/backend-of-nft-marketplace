import { LoggerOptions } from 'pino';

export const defaultPinoOptions: LoggerOptions = {
  prettyPrint:
    process.env.NODE_ENV !== 'production'
      ? { colorize: true, translateTime: true }
      : false,
  level: 'info',
};
