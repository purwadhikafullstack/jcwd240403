'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    user_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    check_in_date: DataTypes.DATE,
    check_out_date: DataTypes.DATE,
    booking_code: DataTypes.STRING,
    price: DataTypes.INTEGER,
    total_invoice: DataTypes.INTEGER,
    payment_proof: DataTypes.STRING,
    payment_status: DataTypes.INTEGER,
    payment_date: DataTypes.DATE,
    booking_status: DataTypes.ENUM('waiting', 'waiting_confirmation', 'cancelled')
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};