const db = require("../models");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");

const createRoom = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { propId, name, description, price } = req.body;
    let imageURL = setFromFileNameToDBValue(req.file.filename);

    const result = await db.Room.create(
      {
        property_id: propId,
        name: name,
        room_img: imageURL,
        description: description,
        base_price: Number(price),
        status: "AVAILABLE",
      },
      { transaction }
    );
    await transaction.commit();
    res.status(200).send({
      message: "Success create room type",
      data: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("createroomtype", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

const getAllRoom = async (req, res) => {
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
};

const getOneRoom = async (req, res) => {
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
};

const updateRoom = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const id = req.params.id;
    const { propId, name, description, price } = req.body;
    let imageURL;

    const room = await db.Room.findOne({
      where: { id: id, property_id: propId },
    });

    if (!room) {
      return res.status(400).send({
        message: "There is no room found",
      });
    }

    if (req.file) {
      console.log("FILEEEEE!!!");
      imageURL = setFromFileNameToDBValue(req.file.filename);
      const oldImage = room.getDataValue("room_img");
      const oldImageFile = getFilenameFromDbValue(oldImage);
      if (oldImage) {
        fs.unlinkSync(getAbsolutePathPublicFile(oldImageFile));
      }
    }

    console.log("image", req);

    const editRoom = await db.Room.update(
      {
        name: name,
        description: description,
        base_price: Number(price),
        room_img: imageURL,
      },
      { where: { id: id, property_id: propId } },
      { transaction }
    );

    const edited = await db.Room.findOne({
      where: { id: id, property_id: propId },
    });

    await transaction.commit();
    res.status(200).send({
      message: "Success edit room detail",
      data: edited,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("oneditroom", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

const deleteRoom = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const id = req.params.id;
    const result = await db.Room.destroy(
      {
        where: { id: id },
      },
      { transaction }
    );

    await transaction.commit();
    res.status(200).send({
      message: "Success delete room",
      data: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("ON DELETE ROOM", error);
    res.status(500).send({
      message: "Something wrong on server.",
    });
    error;
  }
};

module.exports = {
  createRoom,
  getAllRoom,
  getOneRoom,
  updateRoom,
  deleteRoom,
};
