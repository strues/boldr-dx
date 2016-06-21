import webpack from 'webpack';
import path from 'path';
import _debug from 'debug';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import isomorphicToolsConfig from './isomorphic.config';
import appCfg from '../../src/config/app.config';
import paths from '../../src/config/paths';

import CSS_LOADER from './loaders/css';
import BABEL_LOADER from './loaders/babel';

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(isomorphicToolsConfig);
const debug = _debug('boldr:webpack:config:dev');

const deps = [
  'react-router-redux/dist/ReactRouterRedux.min.js',
  'redux/dist/redux.min.js'
];

// By specifying our dependencies here, it allows us to easily split our
// bundle into an app and a vendor bundle. This is useful for caching.
const VENDOR_DEPENDENCIES = [
  'react',
  'react-dom',
  'redux-thunk',
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux',
  'axios'
];

const {
  SERVER_HOST,
  APP_ENTRY,
  WEBPACK_DEV_SERVER_PORT,
  __CLIENT__,
  __SERVER__,
  __DEV__,
  __PROD__,
  __DEBUG__,
  __TEST__
} = appCfg;

const HOT_MW_PATH = `http://${SERVER_HOST}:${WEBPACK_DEV_SERVER_PORT}/__webpack_hmr`;
const HOT_MW = `webpack-hot-middleware/client?path=${HOT_MW_PATH}&reload=true&timeout=20000`;

debug('Create configuration.');
const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      HOT_MW,
      appCfg.APP_ENTRY
    ],
    vendors: VENDOR_DEPENDENCIES
  },
  output: {
    path: paths.BUILD_DIR,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: `http://localhost:${WEBPACK_DEV_SERVER_PORT}/build/`
  },
  resolve: {
    alias: {},
    // Resolve the `./src` directory so we can avoid writing
    // ../../styles/base.css but styles/base.css
    root: [paths.SRC_DIR],
    extensions: ['', '.js', '.jsx']
  },
  context: paths.ROOT_DIR,
  module: {
    noParse: [],
    // FWIW: preLoaders like linting will slow the build down.
    preLoaders: [
      {
        test: /\.js[x]?$/,
        loader: 'eslint',
        include: [paths.SRC_DIR]
      }
    ],
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel',
        exclude: [paths.NODE_MODULES_DIR],
        include: [paths.SRC_DIR],
        query: BABEL_LOADER
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('styles'),
        include: [paths.SRC_DIR],
        loaders: [
          'style',
          CSS_LOADER,
          'postcss',
          'sass?sourceMap'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=fonts/[name].[ext]'
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url?limit=10000'
      }
    ]
  },
  // specific postcss loader packages.
  postcss: wPack => ([
    require('postcss-import')({ addDependencyTo: wPack }),
    require('autoprefixer')({ browsers: ['last 2 versions'] })
  ]),

  plugins: [
    // Varies the distribution of the ids to get the smallest id length for often used ids.
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // It identifies common modules and places them into a common chunk.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common', filename: 'common.js', async: true, minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __CLIENT__,
      __SERVER__,
      __DEV__,
      __PROD__,
      __TEST__,
      __DEBUG__
    }),
    webpackIsomorphicToolsPlugin.development()
  ],
  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

// Optimizing rebundling
deps.forEach(dep => {
  const depPath = path.resolve(paths.NODE_MODULES_DIR, dep);

  config.resolve.alias[dep.split(path.sep)[0]] = depPath;
  config.module.noParse.push(depPath);
});

export default config;
