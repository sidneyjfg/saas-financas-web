const { Plan } = require("../models");

class PlanRepository {
  async findById(id) {
    return Plan.findByPk(id);
  }

  async getAll() {
    return Plan.findAll();
  }
}

module.exports = new PlanRepository();
