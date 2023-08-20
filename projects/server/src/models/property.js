"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.belongsTo(models.User, { foreignKey: "user_id" });
      Property.belongsTo(models.Property_type, {
        foreignKey: "property_type_id",
      });
      Property.belongsTo(models.Location, { foreignKey: "location_id" });
      Property.belongsTo(models.Category_area, {
        foreignKey: "category_area_id",
      });
      Property.hasMany(models.Room, { foreignKey: "property_id" });
    }
  }
  Property.init(
    {
      user_id: DataTypes.INTEGER,
      property_type_id: DataTypes.INTEGER,
      location_id: DataTypes.INTEGER,
      category_area_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Property",
    }
  );
  return Property;
};
