const Boom = require('boom');

const errorMiddleware = async function(ctx, next) {
  try {
    await next();
  } catch (e) {
    const error = Boom.isBoom(e) ? e : Boom.boomify(e, {statusCode: 500});
    logger.error(error);
    const errorPayload = error.output.payload;
    const errorMessage = errorPayload.message;
    errorPayload.message = ctx.__(`errors.${errorMessage}`) || errorMessage;
    ctx.body = errorPayload;
    ctx.status = error.output.statusCode;
  }
};

module.exports = errorMiddleware;