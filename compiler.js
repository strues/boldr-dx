require('babel-core/register');
require('jsdom-global')();
const config = require('./src/config');
global.nodeRequire = require;
global.__DEV__ = config.__DEV__;
const noop = (module, file) => {
  module._compile('', file);
};
global.navigator = {
  userAgent: 'node.js'
};
[
  '.css', '.scss',
  '.gif', '.jpg', '.png', '.svg',
  '.ttf', '.eot', '.woff', '.woff2'
].forEach((extension) => {
  require.extensions[extension] = noop;
});
