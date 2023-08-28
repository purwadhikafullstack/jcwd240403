"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   city: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Locations",
      [
        {
          id: 1,
          city: "Jakarta",
        },
        {
          id: 2,
          city: "Bandung",
        },
        {
          id: 3,
          city: "Yogyakarta",
        },
        {
          id: 4,
          city: "Semarang",
        },
        {
          id: 5,
          city: "Surabaya",
        },
        {
          id: 6,
          city: "Bali",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Locations", null, {});
  },
};
