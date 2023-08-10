const { compareSync } = require("bcryptjs");
const db = require("../models");
const { where } = require("sequelize");

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

  async getOneMyPropType(req, res) {
    try {
      const id = Number(req.params.id);
      const userId = req.user.id;
      const result = await db.Property_type.findOne({
        where: { id: id, user_id: userId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!result) {
        return res.status(400).send({
          message: "Property type not found",
        });
      }
      res.status(200).send({
        message: "Success get property type",
        data: result,
      });
    } catch (error) {
      console.log("myOnePropType", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async editMyPropType(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { newName } = req.body;
      const propType = await db.Property_type.findOne({
        where: { id: id, user_id: userId },
      });

      if (!propType) {
        return res.status(400).send({
          message: "Property type not found",
        });
      }

      await db.Property_type.update({ name: newName }, { where: { id: id } });

      const updatedPropType = await db.Property_type.findOne({
        where: { id: id, user_id: userId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      res.status(201).send({
        message: "Success update property type name",
        data: updatedPropType,
      });
    } catch (error) {
      console.log("editproptype", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async deleteMyPropertyType(req, res) {
    try {
      const id = Number(req.params.id);
      const userId = req.user.id;

      const propType = await db.Property_type.findOne({
        where: { id: id, user_id: userId },
      });

      if (!propType) {
        return res.status(400).send({
          message: "Property type not found",
        });
      }

      await propType.destroy();

      return res.status(200).send({
        message: "Property type successfuly deleted",
      });
    } catch (error) {
      console.log("deleteproptype", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },
};
