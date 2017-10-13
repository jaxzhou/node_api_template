import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import {name, version} from '../../../package.json';
import logger from './logger';
import cors from './cors';
import auth from './auth';
import swagger from './swagger';

class ApiServer {

  constructor() {
    let server = express();
    server.title = name;
    server.version = version;

    server.use(session({
      secret: name,
      resave: false,
      saveUninitialized: true}));
    server.use(bodyParser.json());
    server.use(cors);
    server.use(logger);
    server.get('/version', (req, res, next) => {
      res.send({name, version});
    });
    server.use(auth.authorization);
    swagger.init(server);
    this.server = server;
  }

  start(options) {
    const port = (options && options.port) || 9030;
    this.server.listen(port, ()=>{
      console.log('%s listening at %s', this.server.name, port);
    });
  }
}

const server = new ApiServer();

export default server;
