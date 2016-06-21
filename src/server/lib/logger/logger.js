import winston from 'winston';
import config from 'config/app.config';

const transports = [];
if (config.logger.console) {
  transports.push(
    new winston.transports.Console({
      handleExceptions: false,
      prettyPrint: true,
      colorize: true,
      level: config.logger.level,
      timestamp: () => new Date().toLocaleString()
    })
  );
}
if (config.logger.files) {
  transports.push(
    new winston.transports.File({
      handleExceptions: false,
      name: 'info-file',
      filename: 'info.log',
      level: 'info'
    })
  );

  transports.push(
    new winston.transports.File({
      handleExceptions: false,
      name: 'error-file',
      filename: 'error.log',
      level: 'error'
    })
  );
}

const logger = new winston.Logger({ transports });
logger.exitOnError = false;

process.on('unhandledRejection', (reason, promise) => {
  logger.warn(`Unhandled rejection at ${promise}\n`, reason);
});

export default logger;
