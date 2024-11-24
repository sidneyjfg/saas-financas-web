const { User } = require("../models");

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(data) {
    return await User.create(data);
  }
}

module.exports = new UserRepository();
