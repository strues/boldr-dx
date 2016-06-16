import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import isomorphicToolsConfig from '../../tools/webpack/isomorphic.config';
import appCfg from 'config/app.config';
import paths from 'config/paths';

const projectBasePath = paths.ROOT_DIR;

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = appCfg.__DEV__;
global.__PROD__ = appCfg.__PROD__;
global.__DEBUG__ = appCfg.__DEBUG__;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools#mainjs
global.webpackIsomorphicTools =
  new WebpackIsomorphicTools(isomorphicToolsConfig)
    .development(__DEV__)
    .server(projectBasePath, () => {
      require('./server');
    });
