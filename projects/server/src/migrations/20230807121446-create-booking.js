"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      room_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Rooms",
          key: "id",
        },
      },
      check_in_date: {
        type: Sequelize.DATEONLY,
      },
      check_out_date: {
        type: Sequelize.DATEONLY,
      },
      booking_code: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      total_invoice: {
        type: Sequelize.INTEGER,
      },
      payment_proof: {
        type: Sequelize.STRING,
      },
      payment_status: {
        type: Sequelize.ENUM("ACCEPTED", "DECLINED"),
      },
      payment_date: {
        type: Sequelize.DATE,
      },
      booking_status: {
        type: Sequelize.ENUM(
          "WAITING_FOR_PAYMENT",
          "PROCESSING_PAYMENT",
          "DONE",
          "CANCELED"
        ),
      },
      cancel_reason: {
        type: Sequelize.STRING,
      },
      reject_reason: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Bookings");
  },
};
