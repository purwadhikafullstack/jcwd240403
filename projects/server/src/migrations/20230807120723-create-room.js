"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      property_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Properties",
          key: "id",
        },
      },
      room_type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Room_types",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("AVAILABLE", "UNAVAILABLE"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Rooms");
  },
};
