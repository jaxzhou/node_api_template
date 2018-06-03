const Koa = require('koa');
const KoaBody = require('koa-body');
const Cors = require('koa-cors');
const Locales = require('koa-locales');
const Middlewares = require('./middlewares');
const Controllers = require('./controllers');

var app = new Koa();
app.use(Cors());
app.use(KoaBody());
Locales(app, {
  dirs: [__dirname + '/locales'],
  defaultLocale: 'zh-CN'
});
app.use(Middlewares());
const controller = new Controllers();
app.use(controller.middlewares());


exports.start = function(options) {
  const {port} = options;
  const listenPort = port || 8010;
  const server = app.listen(listenPort);
  console.info(`Server listen at ${listenPort}`)
  return server;
}
