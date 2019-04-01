import * as winston from 'winston';
import * as path from 'path';

interface ILogger {
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  debug: (message: string) => void;
}

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(info => {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
    }`;
  }),
);

const systemLog = winston.createLogger({
  format: alignedWithColorsAndTime,
  transports: [new winston.transports.Console({ level: 'info' })],
});

const getLogger = (fileName: string): ILogger => {
  const baseName = path.basename(fileName);
  return {
    error: (message: string) => {
      systemLog.error(`(${baseName}) ${message}`);
    },
    warn: (message: string) => {
      systemLog.warn(`(${baseName}) ${message}`);
    },
    info: (message: string) => {
      systemLog.info(`(${baseName}) ${message}`);
    },
    debug: (message: string) => {
      systemLog.debug(`(${baseName}) ${message}`);
    },
  };
};

export { getLogger, ILogger };
