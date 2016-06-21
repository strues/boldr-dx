import http from 'http';
import { inspect } from 'util';

import app from './app';
import logger from './lib/logger';
import config from 'config/app.config';
const { SERVER_HOST, SERVER_PORT, WEBPACK_DEV_SERVER_PORT } = config;
const server = http.createServer(app.callback());

(async() => {
  try {
    server.listen(SERVER_PORT, () => {
      logger.info(`Server is listening on ${SERVER_PORT}, in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    // handle uncaught exceptions
    process.on('uncaughtException', err => {
      logger.error(inspect(err && err.stack || err, {
        colors: true,
        showHidden: true,
        depth: null
      }));
    });
  }
  server.on('close', () => {
    logger.info('Closing connection');
  });

    // handle graceful restarts
  process.on('SIGTERM', () => {
    if (!server || !server.close) {
      return process.exit(0);
    }
    server.close((err) => {
      if (err) {
        app.emit('error', err);
        process.exit(1);
        return;
      }
      process.exit(0);
    });
  });
})();

export default server;
