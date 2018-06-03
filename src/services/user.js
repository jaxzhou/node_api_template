

class UserService {

  async listUsers(filter, pagination) {
    return [];
  }

  async createNewUser(user) {
    return user;
  }

  async getUserById(uid) {
    return {userid: uid};
  }

  async getUsersByName(name) {
    return [];
  }
}

module.exports = new UserService();
