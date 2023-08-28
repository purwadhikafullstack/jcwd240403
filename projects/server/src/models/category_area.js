"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category_area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category_area.hasMany(models.Property, {
        foreignKey: "category_area_id",
      });
      Category_area.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Category_area.init(
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      is_deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Category_area",
      timestamps: false,
    }
  );
  return Category_area;
};
