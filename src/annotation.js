const Joi = require('joi');
const Compose = require('koa-compose');

function route(method, uri) {
  return (target, key, descriptor) => {
    if (!method || !uri) return;
    const routes = target.routes || {};
    if (!routes[uri]) {
      routes[uri] = {};
    }
    routes[uri][method.toLowerCase()] = key;
    Object.defineProperty(target, 'routes', {
      value: routes
    });
  }
}

function query(schema) {
  return (target, key, descriptor) => {
    const schemaValidate = async (ctx, next) => {
      const {error, value} = Joi.validate(ctx.request.query, schema);
      if (error) {
        ctx.response.status = 400;
      } else {
        ctx.request.query = value;
        await next();
      }
    };
    const {value} = descriptor;
    descriptor.value = Compose([schemaValidate, value]);
  }
}

function body(schema) {
  return (target, key, descriptor) => {
    const schemaValidate = async (ctx, next) => {
      const {error, value} = Joi.validate(ctx.request.body, schema);
      if (error) {
        ctx.response.status = 400;
      } else {
        ctx.request.body = value;
        await next();
      }
    };
    const {value} = descriptor;
    descriptor.value = Compose([schemaValidate, value]);
  }
}

function auth() {
  return (target, key, descriptor) => {
    const authValidate = async (ctx, next) => {
      if (!ctx.auth) {
        ctx.response.status = 401;
      } else {
        await next();
      }
    };
    const {value} = descriptor;
    descriptor.value = Compose([authValidate, value]);
  }
}

module.exports = {
  route,
  body,
  query,
  auth
};
