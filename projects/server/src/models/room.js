"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.Property, { foreignKey: "property_id" });
      Room.hasMany(models.Room_status, { foreignKey: "room_id" });
      Room.hasMany(models.Special_price, { foreignKey: "room_id" });
    }
  }
  Room.init(
    {
      property_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      room_img: DataTypes.STRING,
      base_price: DataTypes.INTEGER,
      status: DataTypes.ENUM("AVAILABLE", "UNAVAILABLE"),
    },
    {
      sequelize,
      modelName: "Room",
      paranoid: true,
      timestamps: true,
    }
  );
  return Room;
};
