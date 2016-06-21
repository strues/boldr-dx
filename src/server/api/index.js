/**
 * src/server/api/index.js
 * Handles all API controller routes
 *
 * @exports {Object} - Koa router objects
 */
import versionRouter from './version/version.router';

export default [
  versionRouter
];
