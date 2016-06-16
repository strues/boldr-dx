import Koa from 'koa';

import config from 'config/app.config';

const app = new Koa();

app.listen(config.port, () => {
  console.log(`Koa server listening on ${config.port}, in ${config.env} mode`);
});
