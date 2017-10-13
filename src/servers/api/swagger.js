import _ from 'lodash';
import swagger from 'swagger-tools';
import fs from 'fs';
import path from 'path';

import auth from './auth';
import {ParamsError, AccessDenied} from '../../models/errors';

class UnExpectError extends Error {
  constructor() {
    super("Unkown Error Happend");
    this.code = "UnExpectError";
    this.status = 500;
  }
}

function processError(err, req, res, next) {
  if (err instanceof Error) {
    return next(err);
  } else if (typeof err === 'string'){
    return next(new Error(err));
  }
  return next(new UnExpectError());
}

function handleError(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).send({code: err.code || "ServerError", message: err.message, message_zh: err.message_zh});
}

function swaggerParamsGet(req, res, next) {
  const getParams = (name, defaultValue) => {
    let value = defaultValue;
    if (req.swagger.params) {
      value = _.get(req.swagger.params, [name, 'value'], defaultValue);
    }
    if (!value && req.params) {
      value = _.get(req.params, name, defaultValue);
    }
    if (!value && req[name]) {
      value = req[name];
    }
    return value;
  }
  req.getParams = getParams;
  next();
}

class SwaggerMiddleare {
  constructor() {
    let doc = {};
    const swaggerFolder = path.resolve(__dirname, '../swagger');
    const files = fs.readdirSync(swaggerFolder);
    files.forEach((file) => {
      const filenams = file.split('.');
      if (filenams[filenams.length-1] !== 'json') {
        return;
      }
      const data = fs.readFileSync(path.resolve(swaggerFolder, file), 'utf8');
      let subDoc = JSON.parse(data);
      for (let key in subDoc) {
        if (doc[key]) {
          Object.assign(doc[key], subDoc[key]);
        } else {
          doc[key] = subDoc[key];
        }
      }
    });
    this.doc = doc;
  }

  init(app) {
    this.doc.info = {
      title: app.title,
      version: app.version
    };
    swagger.initializeMiddleware(this.doc, (middleware) => {
      app.use(middleware.swaggerMetadata());
      app.use(middleware.swaggerValidator(), (err, req, res, next) =>{
        if (err) {
          next(err);
        } else {
          next(ParamsError);
        }
      });
      app.use(swaggerParamsGet);
      app.use(middleware.swaggerRouter({useStubs: false, controllers: path.resolve(__dirname, '../../controllers')}));
      app.use(processError, handleError);
      if (process.env.NODE_ENV !== 'production') {
        app.use(middleware.swaggerUi({
          apiDocs: '/swagger/api-docs',
          swaggerUi: '/swagger/docs'
        }));
        auth.free('/swagger/');
        auth.free('/auth/');
      }
    });
  }
}

export default new SwaggerMiddleare();
