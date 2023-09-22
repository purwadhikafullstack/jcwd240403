const db = require("../models");
const { Op } = require("sequelize");

const getAllLocation = async (req, res) => {
  try {
    const result = await db.Location.findAll();
    res.status(200).send({
      message: "Success get all locations",
      data: result,
    });
  } catch (error) {
    console.log("allLoc", error);
    res.status(500).send({
      message: "Something wrong on server",
    });
  }
};

const getAllPropType = async (req, res) => {
  try {
    const result = await db.Property_type.findAll();
    res.status(200).send({
      message: "Success get all property type",
      data: result,
    });
  } catch (error) {
    console.log("allproptype", error);
    res.status(500).send({
      message: "Something wrong on server",
    });
  }
};

const getTopProperty = async (req, res) => {
  try {
    const top = await db.Booking.findAll({
      where: { booking_status: "DONE" },
      attributes: [
        "room_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("room_id")), "count"],
      ],
      group: ["room_id"],
      order: [[db.sequelize.literal("count"), "DESC"]],
    });

    const roomIds = top.map((item) => item.room_id);

    const topRooms = await db.Room.findAll({
      where: {
        id: {
          [db.Sequelize.Op.in]: roomIds,
        },
      },
    });

    const propertyIds = topRooms.map((room) => room.property_id);

    const topProperties = await db.Property.findAll({
      where: {
        id: {
          [db.Sequelize.Op.in]: propertyIds,
        },
      },
    });

    const topFiveProperties = topProperties.slice(0, 5);

    res.status(200).send({
      message: "Get top properties success.",
      topBookingData: top,
      topRooms: topRooms,
      topProperty: topFiveProperties,
    });
  } catch (error) {
    console.log("TOP PROPERTY", error);
    res.status(500).send({
      message: "Something wrong on server",
    });
    error;
  }
};

module.exports = {
  getAllLocation,
  getAllPropType,
  getTopProperty,
};
