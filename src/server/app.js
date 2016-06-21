/**
 * src/server
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
import proxy from 'koa-proxy';
import { join } from 'path';
import _debug from 'debug';
import http from 'http';

import { handleRender } from './utils/renderReact';
import config from '../config/app.config';
import routers from './api';
import { logger } from './lib';
// Application constants
const { SERVER_HOST, SERVER_PORT, __TEST__, WEBPACK_DEV_SERVER_PORT } = config;

const app = new Koa();
app.proxy = true;
app.env = process.env.NODE_ENV;
app.keys = [config.JWT_SECRET];

// allow both legacy and modern middleware
// https://www.npmjs.com/package/koa-convert
const use = app.use;
app.use = x => use.call(app, convert(x));

app
  .use(bodyParser());

/**
 * Loads the development specific functions
 * @param  {Boolean} __DEV__ Global variable for development environment
 * @return {InitDev}        The initializer class for development
 */
if (!process.env === 'production') {
  app.use(convert(proxy({
    host: `http://${SERVER_HOST}:${WEBPACK_DEV_SERVER_PORT}`,
    match: /^\/build\//
  })));
}

// App logging
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const end = new Date();
  logger.verbose(`${ctx.method} ${ctx.status} ${ctx.url} => ${end - start}ms`);
});

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

// Error pages
// eslint-disable-next-line consistent-return
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.app.emit('error', error, ctx);

    const pkg = {
      status: error.status || 500
    };

    if (app.env === 'development') {
      pkg.detail = error.stack;
    }

    if (error.expose) {
      pkg.title = error.message || 'Boldr has encountered an error';
    } else {
      pkg.title = 'Boldr has encountered an error';
    }

    ctx.status = pkg.status;

    return ctx.render('error', { error: pkg });
  }
});

// Error logging
app.on('error', async (error, ctx, next) => {
  if (app.env === 'test') {
    return;
  }

  if (/4.*/.test(error.status)) {
    logger.verbose(`${ctx.method} ${ctx.status} ${ctx.url} |> ${error.message}`);
  } else {
    logger.error(error);
  }

  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Something went terribly wrong and things might get heated. Try again?';
    return;
  }
});

if (!__TEST__) {
// Serve the React html
  app.use(handleRender);
}

app.use(mount('/static', serve(join(__dirname, '..', '..', 'static'))));

export default app;
