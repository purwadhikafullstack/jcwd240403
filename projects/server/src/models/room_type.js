'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room_type.init({
    name: DataTypes.STRING,
    room_img: DataTypes.STRING,
    description: DataTypes.STRING,
    base_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Room_type',
  });
  return Room_type;
};