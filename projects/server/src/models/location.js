"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Location.hasMany(models.Property, { foreignKey: "location_id" });
    }
  }
  Location.init(
    {
      city: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Location",
      timestamps: false,
    }
  );
  return Location;
};
