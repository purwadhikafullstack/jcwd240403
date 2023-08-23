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
      const id = req.params.id;
      const result = await db.Room.findAll({
        where: { property_id: id, deletedAt: null },
        include: [{ model: db.Property, attributes: ["id", "name"] }],
      });

      if (!result) {
        return res.status(200).send({
          message: "You dont have any room on this property",
          data: [],
        });
      }

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

      const result = await db.Room.findOne({
        where: { id: id, deletedAt: null },
      });

      if (!result) {
        return res.status(400).send({
          message: "There is no room found",
        });
      }

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
      const id = req.params.id;
      const { propId, name, description, price } = req.body;
      let imageURL;
      if (req.file) {
        imageURL = setFromFileNameToDBValue(req.file.filename);
      }

      const room = await db.Room.findOne({
        where: { id: id, property_id: propId },
      });

      if (!room) {
        return res.status(400).send({
          message: "There is no room found",
        });
      }

      const oldImage = room.getDataValue("room_img");
      const oldImageFile = getFilenameFromDbValue(oldImage);
      if (oldImage) {
        fs.unlinkSync(getAbsolutePathPublicFile(oldImageFile));
      }

      const editRoom = await db.Room.update(
        {
          name: name,
          description: description,
          base_price: Number(price),
          room_img: imageURL,
        },
        { where: { id: id, property_id: propId } }
      );

      const edited = await db.Room.findOne({
        where: { id: id, property_id: propId },
      });

      res.status(200).send({
        message: "Success edit room detail",
        data: edited,
      });
    } catch (error) {
      console.log("oneditroom", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async deleteRoom(req, res) {
    try {
      const id = req.params.id;
      const result = await db.Room.destroy({
        where: { id: id },
      });

      res.status(200).send({
        message: "Success delete room",
        data: result,
      });
    } catch (error) {}
  },
};
