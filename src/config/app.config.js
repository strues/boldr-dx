import { argv } from 'yargs';
import path from 'path';
import paths from './paths';

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  // Environment
  __CLIENT__: true,
  __SERVER__: false,
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',
  __DEBUG__: !!argv.debug,
  // Entry file
  APP_ENTRY: `${paths.APP_DIR}/client.jsx`,
  // Server Configuration
  SERVER_HOST: 'localhost',
  SERVER_PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'boldr',
  // Webpack Configuration
  WEBPACK_DEV_SERVER_PORT: 3001,
  PG_USER: process.env.PG_USER || 'postgres',
  PG_HOST: process.env.PG_HOST || 'localhost',
  PG_PORT: process.env.PG_PORT || 5432,
  PG_DB_NAME: process.env.PG_DB_NAME || 'boldr',
  session: {
    ttl: 3600,
    db: 0,
    cookiekey: 'bldr',
    secure: false,
    http_only: false,
    domain: undefined
  },
  logger: {
    console: true,
    level: 'silly', // 'silly' 'debug' 'verbose' 'info' 'warn' 'error'
    files: false
  },
  PATH_BASE: paths.ROOT_DIR
};
export { config as default };
