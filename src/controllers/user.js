const Joi = require('joi');
const Controller = require('./index');
const {route, auth, body} = require('../annotation');

const {UserService} = require('../services');

const UserSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email()
});

class UserController {

  @route('get', '/users')
  @auth()
  async list(ctx, next) {
    const users = await UserService.listUsers();
    ctx.body = users;
  }

  @route('post', '/users')
  @auth()
  @body(UserSchema)
  async addUser(ctx, next) {
    const userdata = ctx.request.body;
    const newUser = await UserService.createNewUser(userdata);
    ctx.body = newUser;
  }

  @route('get', '/users/:id')
  @auth()
  async getUserById(ctx, next) {
    const userid = ctx.params.id;
    const getUser = await UserService.getUserById(userid);
    ctx.body = getUser;
  }

}

module.exports = UserController;