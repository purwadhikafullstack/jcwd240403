"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "isLoginBySocial", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    return queryInterface.addColumn("Users", "isRegisterBySocial", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "isLoginBySocial");
    return queryInterface.removeColumn("Users", "isRegisterBySocial");
  },
};
