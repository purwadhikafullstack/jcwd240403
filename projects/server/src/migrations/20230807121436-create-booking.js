'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      room_id: {
        type: Sequelize.INTEGER
      },
      check_in_date: {
        type: Sequelize.DATE
      },
      check_out_date: {
        type: Sequelize.DATE
      },
      booking_code: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      total_invoice: {
        type: Sequelize.INTEGER
      },
      payment_proof: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.INTEGER
      },
      payment_date: {
        type: Sequelize.DATE
      },
      booking_status: {
        type: Sequelize.ENUM('waiting', 'waiting_confirmation', 'cancelled')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};