const { compareSync } = require("bcryptjs");
const db = require("../models");
const { where } = require("sequelize");

module.exports = {
  async getAllCatArea(req, res) {
    try {
      const result = await db.Category_area.findAll({
        where: { is_deleted: false },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).send({
        message: "Success get all category area",
        data: result,
      });
    } catch (error) {
      console.log("getallcatarea", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async addCatArea(req, res) {
    try {
      const userId = req.user.id;
      const { categoryArea } = req.body;

      const newCategoryArea = await db.Category_area.create({
        user_id: userId,
        name: categoryArea,
      });
      res.status(201).send({
        message: "Success add new category area",
        data: newCategoryArea,
      });
    } catch (error) {
      console.log("errAddCatArea", error);
      res.status(500).send({ message: "Something wrong on server", error });
    }
  },

  async getOneMyCatArea(req, res) {
    try {
      const id = Number(req.params.id);
      const userId = req.user.id;
      const result = await db.Category_area.findOne({
        where: { id: id, user_id: userId, is_deleted: false },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!result) {
        return res.status(400).send({
          message: "Category area not found",
        });
      }
      res.status(200).send({
        message: "Success get category area",
        data: result,
      });
    } catch (error) {
      console.log("myOneCatArea", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async editMyCatArea(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { newName } = req.body;
      const result = await db.Category_area.findOne({
        where: { id: id, user_id: userId, is_deleted: false },
      });

      if (!result) {
        return res.status(400).send({
          message: "Property type not found",
        });
      }

      await db.Category_area.update({ name: newName }, { where: { id: id } });

      const updatedCatArea = await db.Category_area.findOne({
        where: { id: id, user_id: userId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      res.status(201).send({
        message: "Success update property type name",
        data: updatedCatArea,
      });
    } catch (error) {
      console.log("editcatarea", error);
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

      const catArea = await db.Category_area.findOne({
        where: { id: id, user_id: userId },
      });

      if (!catArea) {
        return res.status(400).send({
          message: "Category area not found",
        });
      }

      catArea.is_deleted = true;
      await catArea.save();

      return res.status(200).send({
        message: "Category area successfuly deleted",
      });
    } catch (error) {
      console.log("deletecatarea", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },
};
