const db = require("../models");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");

module.exports = {
  async createRoom(req, res) {
    try {
      const { propId, name, description, price } = req.body;
      let imageURL = setFromFileNameToDBValue(req.file.filename);

      const result = await db.Room.create({
        property_id: propId,
        name: name,
        room_img: imageURL,
        description: description,
        base_price: Number(price),
        status: "AVAILABLE",
      });
      res.status(200).send({
        message: "Success create room type",
        data: result,
      });
    } catch (error) {
      console.log("createroomtype", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async getAllRoom(req, res) {
    try {
      const { propId } = req.body;
      const result = await db.Room.findAll({
        where: { property_id: propId, deletedAt: null },
        include: [{ model: db.Property, attributes: ["id", "name"] }],
      });
      res.status(200).send({
        message: "Success get all room from this property",
        data: result,
      });
    } catch (error) {
      console.log("GETALLROOM", error);
      res.status(500).send({
        message: "Something wrong on server",
      });
    }
  },

  async getOneRoom(req, res) {
    try {
      const id = req.params.id;
      const { propId } = req.body;

      const result = await db.Room.findOne({
        where: { id: id, property_id: propId },
      });
      res.status(200).send({
        message: "Success get room detail",
        data: result,
      });
    } catch (error) {
      console.log("getoneroom", error);
      res.status(500).send({
        message: "Something error on server",
      });
    }
  },

  async updateRoom(req, res) {
    try {
    } catch (error) {}
  },

  async deleteRoom(req, res) {
    try {
    } catch (error) {}
  },
};
