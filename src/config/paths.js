import path from 'path';

export const ROOT_DIR = path.normalize(path.join(__dirname, '..', '..'));

const paths = Object.freeze({
  ROOT_DIR,
  NODE_MODULES_DIR: path.join(ROOT_DIR, 'node_modules'),
  BUILD_DIR: path.join(ROOT_DIR, 'build'),
  DIST_DIR: path.join(ROOT_DIR, 'dist'),
  SRC_DIR: path.join(ROOT_DIR, 'src'),
  APP_DIR: path.join(ROOT_DIR, 'src', 'app'),
  API_DIR: path.join(ROOT_DIR, 'src', 'server'),
  SASS_DIR: path.join(ROOT_DIR, 'src', 'app', 'styles'),
  ASSETS_DIR: path.join(ROOT_DIR, 'static', 'assets'),
  HOT_RELOAD_PORT: process.env.HOT_RELOAD_PORT || 3001
});

export const NODE_MODULES_DIR = paths.NODE_MODULES_DIR;
export const BUILD_DIR = paths.BUILD_DIR;
export const DIST_DIR = paths.DIST_DIR;
export const SRC_DIR = paths.SRC_DIR;
export const API_DIR = paths.API_DIR;
export const APP_DIR = paths.APP_DIR;
export const SASS_DIR = paths.SASS_DIR;
export const ASSETS_DIR = paths.ASSETS_DIR;

export default paths;
