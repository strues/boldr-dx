import { argv } from 'yargs';
import koaWebpackDevMiddleware from 'koa-webpack-dev-middleware';
import convert from 'koa-convert';

const QUIET_MODE = !!argv.quiet;

export default function(compiler, options) {
  const webpackDevMiddlewareOptions = {
    ...options,
    quiet: QUIET_MODE,
    noInfo: QUIET_MODE,
    stats: {
      colors: true
    },
    hot: true,
    lazy: false,
    inline: false,
    historyApiFallback: true,
    // proxy: {
    //   '*': 'http://' + proxy.hostname + ':' + proxy.port
    // },
    contentBase: 'http://localhost:3001',
    headers: { 'Access-Control-Allow-Origin': '*' }
  };

  return convert(koaWebpackDevMiddleware(compiler, webpackDevMiddlewareOptions));
}
