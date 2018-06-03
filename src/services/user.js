const Boom = require('boom');

class UserService {

  async listUsers(filter, pagination) {
    return [];
  }

  async createNewUser(user) {
    return user;
  }

  async getUserById(uid) {
    if (!uid || !parseInt(uid)) {
      throw Boom.notFound('UserNotFound');
    }
    return {userid: uid};
  }

  async getUsersByName(name) {
    return [];
  }
}

module.exports = new UserService();
