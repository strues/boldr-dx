/**
 * src/server/api/version/version.router
 * Endpoint displaying the application version
 *
 * @exports {Object} - versionRouter
 */

import Router from 'koa-router';
import pkg from '../../../../package.json'; // eslint-disable-line

const info = {
  name: pkg.name,
  version: pkg.version,
  env: process.env.NODE_ENV
};

const versionRouter = new Router();

versionRouter.prefix('/api/v1/version');

versionRouter.get('/', async (ctx) => {
  ctx.body = info;
});

export default versionRouter;
