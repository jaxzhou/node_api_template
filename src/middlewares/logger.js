const config = require('config');
const bunyan = require('bunyan');

const loggerConfig = config.get('logger');

const logger = bunyan.createLogger(loggerConfig);
if (process.env.NODE_ENV === 'development') {
  logger.addStream({
    name: "console",
    stream: process.stdout,
    level: "debug"
  });
}
global.logger = logger;

const loggerMiddleware = async function(ctx, next) {
  ctx.logger = logger;
  const startTime = new Date().getTime();
  await next();
  const endTime = new Date().getTime();
  const duration = endTime - startTime;
  const requestInfo = {
    method: ctx.request.method,
    url: ctx.url,
    remote: ctx.request.ip,
    responseTime: duration
  };
  logger.info(requestInfo);
};

module.exports = loggerMiddleware;