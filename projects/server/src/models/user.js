"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { foreignKey: "user_id" });
      User.hasMany(models.Property, { foreignKey: "user_id" });
      User.hasMany(models.Booking, { foreignKey: "user_id" });
      User.hasMany(models.Category_area, { foreignKey: "user_id" });
      User.hasMany(models.Booking, { foreignKey: "user_id" });
    }

    
  }
  User.init(
    {
      role: DataTypes.ENUM("TENANT", "USER"),
      verify_token: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      otp: DataTypes.STRING,
      otp_created_time: DataTypes.STRING,
      otp_counter: DataTypes.INTEGER,
      forgot_token: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isLoginBySocial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      isRegisterBySocial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
