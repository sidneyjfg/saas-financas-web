module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("plans", [
      {
        name: "Basic",
        price: 0,
        features: JSON.stringify(["dashboard", "reports"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Premium",
        price: 29.99,
        features: JSON.stringify(["dashboard", "reports"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("plans", null, {});
  },
};
