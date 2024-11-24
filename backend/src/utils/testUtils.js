const db = require('../models');

module.exports = {
  clearDatabase: async () => {
    await db.sequelize.sync({ force: true });
  },
};

