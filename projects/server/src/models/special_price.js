"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Special_price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Special_price.belongsTo(models.Room, { foreignKey: "room_id" });
    }
  }
  Special_price.init(
    {
      room_id: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Special_price",
    }
  );
  return Special_price;
};
