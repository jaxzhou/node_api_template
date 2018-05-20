const Controller = require('./index');

const route = Controller.route;
const auth = Controller.auth;


class UserController {

  @route('get', '/users')
  @auth()
  async list(ctx, next) {
    ctx.body = [];
  }

  @route('get', '/users/:id')
  @auth()
  async getUserById(ctx, next) {
    const userid = ctx.params.id;
    ctx.body = {userid};
  }
}

module.exports = UserController;