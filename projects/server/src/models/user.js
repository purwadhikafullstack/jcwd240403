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
    }
  }
  User.init(
    {
      role: DataTypes.ENUM("tenant", "user"),
      verify_token: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      otp: DataTypes.STRING,
      otp_expired_time: DataTypes.INTEGER,
      otp_counter: DataTypes.INTEGER,
      forgot_token: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
