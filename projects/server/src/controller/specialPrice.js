const db = require("../models");
const moment = require("moment-timezone");

const addSpecialPrice = async (req, res) => {
  try {
    const { roomId, specialPrice, startDate, endDate } = req.body;
    const isExist = await db.Room.findOne({
      where: { id: roomId },
    });
    if (!isExist) {
      return res.status(400).send({
        message: "Room not found",
      });
    }

    if (isExist) {
      const result = await db.Special_price.create({
        room_id: roomId,
        price: specialPrice,
        start_date: moment(startDate)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        is_active: true,
      });
      res.status(201).send({
        message: "Success add special price",
        ceking: isExist,
        data: result,
      });
    }
  } catch (error) {
    console.log("add special price", error);
    res.status(500).send({
      message: "something wrong on server",
    });
  }
};

const getAllSpecialPrice = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const property = await db.Property.findOne({
      where: { id: id, user_id: userId },
      include: [
        {
          model: db.Room,
          include: [
            {
              model: db.Special_price,
            },
          ],
          where: { deletedAt: null },
        },
      ],
    });

    if (!property) {
      return res.status(400).send({
        message: "Property not found",
      });
    }

    const roomsWithPrices = property.Rooms.map((room) => ({
      ...room.get(),
      // special_prices: room.Special_prices,
    }));
    console.log("TEST", property.Rooms);

    res.status(200).send({
      message: "Success get data",
      data: roomsWithPrices,
    });
  } catch (error) {
    console.log("on get all special price", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

const getOneSpecialPrice = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.Special_price.findOne({
      where: { id: id },
      include: [{ model: db.Room }],
    });
    if (!result) {
      return res.status(400).send({
        message: "No special price data found",
      });
    }

    res.status(200).send({
      message: "Success get one special price data",
      data: result,
    });
  } catch (error) {
    console.log("get one special price", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

const editSpecialPrice = async (req, res) => {
  try {
    const id = req.params.id;
    const { specialPrice, startDate, endDate, isActive } = req.body;

    const isExist = await db.Special_price.findOne({
      where: { id: id },
    });
    if (!isExist) {
      return res.status(400).send({
        message: "Special price data not found",
      });
    }

    const updatePrice = await db.Special_price.update(
      {
        price: specialPrice,
        start_date: moment(startDate)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        is_active: isActive,
      },
      { where: { id: id } }
    );

    const updated = await db.Special_price.findOne({
      where: { id: id },
    });

    res.status(201).send({
      message: "Success edit special price",
      data: updated,
    });
  } catch (error) {
    console.log("edit special price", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

module.exports = {
  addSpecialPrice,
  getAllSpecialPrice,
  getOneSpecialPrice,
  editSpecialPrice,
};
