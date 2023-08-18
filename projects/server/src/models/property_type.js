"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Property_type.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Property_type",
      timestamps: false,
    }
  );
  return Property_type;
};
