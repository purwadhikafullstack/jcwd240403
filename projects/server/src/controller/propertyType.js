const { compareSync } = require("bcryptjs");
const db = require("../models");

module.exports = {
  async getAllPropType(req, res) {
    try {
      const result = await db.Property_type.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).send({
        message: "Success get all property type",
        data: result,
      });
    } catch (error) {
      console.log("getallproptype", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async addPropertyType(req, res) {
    try {
      const userId = req.user.id;
      const { propertyType } = req.body;

      const newPropertyType = await db.Property_type.create({
        user_id: userId,
        name: propertyType,
      });
      res.status(201).send({
        message: "Success add new property type",
        data: newPropertyType,
      });
    } catch (error) {
      console.log("errAddPropType", error);
      res.status(500).send({ message: "Something wrong on server", error });
    }
  },
};
