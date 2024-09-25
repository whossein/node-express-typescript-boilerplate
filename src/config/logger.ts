import winston, { log } from 'winston';
import config from './config';
import { Environment } from './constants';

const env = config.env;

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: env === Environment.development ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    env === Environment.development
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;

export default logger;
