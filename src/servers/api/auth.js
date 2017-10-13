import _ from 'lodash';
import jwt from 'jsonwebtoken';

import {UnAuthorized} from '../../models/errors';

class AuthMiddleware {
  constructor() {
    this.frees = [];
    this.authorization = this.authorization.bind(this);
    this.cas = new CASAuthentication({
      cas_url: 'https://localhost/cas',
      service_url: 'http://localhost'
    });
  }

  free(path) {
    if (_.isString(path) && path[0] !== '^') {
      this.frees.push(`^${path}`);
    } else {
      this.frees.push(path);
    }
  }

  authorization(req, res, next) {
    const path = req.path;
    const isFree = _.some(this.frees, r => {
      if (path.match(r)) {
        return true;
      }
      return false;
    });
    if (isFree) {
      return next();
    }

    const authorization = req.get('Authorization');
    if (authorization) {
      const user = jwt.verify(authString, 'node-api-template-auth-key');
      if (user) {
        req.user = user;
        return next();
      }
    }
    next(UnAuthorized);
  }
}

export default new AuthMiddleware();
