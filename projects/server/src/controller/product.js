const db = require("../models");
const { dirname } = require("path");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");
const Op = db.Sequelize.Op;

const getAllProperty = async (req, res) => {
  try {
    const { start_date, end_date, location } = req.query;
    const getAvailable = await db.Property.findAll({
      attributes: ["id", "name", "description"],
      where: {
        is_active: true,
        location_id: location,
        deletedAt: null,
      },
      include: [
        {
          model: db.Picture,
        },
        {
          model: db.Property_type,
        },
        {
          model: db.Location,
        },
        {
          model: db.Room,
          attributes: [
            "id",
            "name",
            "description",
            "base_price",
            "room_img",
            "status",
          ],
          where: {
            status: "AVAILABLE",
            deletedAt: null,
          },
          include: [
            {
              model: db.Special_price,
            },
            {
              model: db.Room_status,
              attributes: ["id", "start_date", "end_date"],
              where: {
                [Op.and]: [
                  {
                    start_date: {
                      [Op.lte]: new Date(`${start_date} 00:00:00`),
                    },
                  },
                  {
                    end_date: {
                      [Op.gte]: new Date(`${end_date} 23:59:59`),
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    return res.send({
      status: true,
      data: getAvailable,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const getDetailProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const getDetail = await db.Property.findOne({
      attributes: ["id", "name", "description"],
      where: {
        id: id,
        deletedAt: null,
      },
      include: [
        {
          model: db.Picture,
        },
        {
          model: db.Property_type,
        },
        {
          model: db.Location,
        },
        {
          model: db.Room,
          attributes: [
            "id",
            "name",
            "description",
            "base_price",
            "room_img",
            "status",
          ],
          where: {
            status: "AVAILABLE",
            deletedAt: null,
          },
          include: [
            {
              model: db.Special_price,
            },
            {
              model: db.Room_status,
              attributes: ["id", "start_date", "end_date"],
            },
          ],
        },
      ],
    });
    return res.send({
      status: true,
      data: getDetail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

module.exports = {
  getAllProperty,
  getDetailProperty,
};
