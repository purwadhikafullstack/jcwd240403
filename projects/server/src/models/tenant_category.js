"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tenant_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tenant_Category.init(
    {
      user_id: DataTypes.INTEGER,
      category_area_id: DataTypes.INTEGER,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Tenant_Category",
    }
  );
  return Tenant_Category;
};
