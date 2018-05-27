const Joi = require('joi');
const Controller = require('./index');
const {route, auth, body} = require('../annotation');

const UserSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email()
});

class UserController {

  @route('get', '/users')
  @auth()
  async list(ctx, next) {
    ctx.body = [];
  }

  @route('post', '/users')
  @auth()
  @body(UserSchema)
  async addUser(ctx, next) {
    const user = ctx.request.body;
    ctx.body = user;
  }

  @route('get', '/users/:id')
  @auth()
  async getUserById(ctx, next) {
    const userid = ctx.params.id;
    ctx.body = {userid};
  }

}

module.exports = UserController;