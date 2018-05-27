const Controller = require('./index');
const {route} = require('../annotation');

class VersionController {

  @route('get', '/version')
  async get(ctx, next) {
    ctx.body = '2.0.0';
  }
}

module.exports = VersionController;