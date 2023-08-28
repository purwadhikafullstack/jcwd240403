"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Category_areas",
      [
        {
          id: 1,
          user_id: null,
          name: "Mountain View",
          is_deleted: false,
        },
        {
          id: 2,
          user_id: null,
          name: "Riverside View",
          is_deleted: false,
        },
        {
          id: 3,
          user_id: null,
          name: "City View",
          is_deleted: false,
        },
        {
          id: 4,
          user_id: null,
          name: "Beach View",
          is_deleted: false,
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
    await queryInterface.bulkDelete("Category_areas", null, {});
  },
};
