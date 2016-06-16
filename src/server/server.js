/**
 * boldr/server
 * Main web server.
 *
 * @exports {Object} app - Koa
 * @exports {Object} server - HTTP built into node.
 */
global.Promise = require('bluebird');
import Koa from 'koa';
import serve from 'koa-static';
import convert from 'koa-convert';
import mount from 'koa-mount';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import proxy from 'koa-proxy';
import { join } from 'path';
import _debug from 'debug';
import { handleRender } from './utils/renderReact';
import config from '../config/app.config';
import routers from './api';
// Application constants
const { SERVER_HOST, SERVER_PORT, WEBPACK_DEV_SERVER_PORT } = config;

const app = new Koa();
app.proxy = true;
app.env = process.env.NODE_ENV;
app.keys = [config.JWT_SECRET];
// allow both legacy and modern middleware
// https://www.npmjs.com/package/koa-convert
const use = app.use;
app.use = x => use.call(app, convert(x));

app
  .use(bodyParser())
  .use(logger());

/**
 * Loads the development specific functions
 * @param  {Boolean} __DEV__ Global variable for development environment
 * @return {InitDev}        The initializer class for development
 */
if (__DEV__) {
  app.use(convert(proxy({
    host: `http://${SERVER_HOST}:${WEBPACK_DEV_SERVER_PORT}`,
    match: /^\/build\//
  })));
}
/**
 * Middlewares set to be available on context.
 * @method use
 */
app.use(async (ctx, next) => {
  ctx.req.body = ctx.request.body;
  await next();
});

// Load the routers.
for (const router of routers) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

app.on('error', err => console.error(err));
// This is fired every time the server side receives a request
app.use(handleRender);
app.use(mount('/static', serve(join(__dirname, '..', '..', 'static'))));

app.listen(SERVER_PORT, () => {
  console.log(`Koa server listening on ${SERVER_PORT}, in ${config.env} mode`);
});
