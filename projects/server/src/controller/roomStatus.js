const db = require("../models");
const moment = require("moment-timezone");

const addRoomStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const { roomId, customStatus, startDate, endDate } = req.body;

    const searchRoom = await db.Room.findOne({
      where: {
        id: roomId,
        deletedAt: null,
      },
      include: [
        {
          model: db.Property,
          where: { user_id: userId, deletedAt: null },
        },
      ],
    });

    if (!searchRoom) {
      return res.status(400).send({
        message: "Room not found.",
      });
    }

    const result = await db.Room_status.create(
      {
        room_id: roomId,
        custom_status: customStatus,
        start_date: moment(startDate)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        is_active: true,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).send({
      message: "Success add room status.",
      data: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("addRommStatus", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const getAllRoomStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const property = await db.Property.findOne({
      where: { id: id, user_id: userId, deletedAt: null },
      include: [
        {
          model: db.Room,
          include: [
            {
              model: db.Room_status,
            },
          ],
          where: { deletedAt: null },
        },
      ],
    });

    if (!property) {
      return res.status(400).send({
        message: "Data not found.",
      });
    }

    const roomsWithStatus = property.Rooms.map((room) => ({
      ...room.get(),
    }));

    res.status(200).send({
      message: "Success get data.",
      data: roomsWithStatus,
    });
  } catch (error) {
    console.log("on get all special price", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const getOneRoomStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const isMine = await db.Property.findOne({
      where: { user_id: userId, deletedAt: null },
    });
    const result = await db.Room_status.findOne({
      where: { id: id },
      include: [
        {
          model: db.Room,
          where: { deletedAt: null },
        },
      ],
    });
    if (!isMine || !result) {
      return res.status(400).send({
        message: "No room status data found.",
      });
    }
    res.status(200).send({
      message: "Success get one room status data.",
      data: result,
    });
  } catch (error) {
    console.log("get one room status", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const editRoomStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const { customStatus, startDate, endDate, isActive } = req.body;

    const isMine = await db.Property.findOne({
      where: { user_id: userId, deletedAt: null },
    });

    const isExist = await db.Room_status.findOne({
      where: { id: id },
      include: [
        {
          model: db.Room,
          where: { deletedAt: null },
        },
      ],
    });

    if (!isMine || !isExist) {
      return res.status(400).send({
        message: "Room status data not found.",
      });
    }

    const updateStatus = await db.Room_status.update(
      {
        custom_status: customStatus,
        start_date: moment(startDate)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        is_active: isActive,
      },
      { where: { id: id }, transaction }
    );

    await transaction.commit();

    const updated = await db.Room_status.findOne({
      where: { id: id },
    });

    res.status(201).send({
      message: "Success edit room status",
      data: updated,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("edit room status", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

module.exports = {
  addRoomStatus,
  getAllRoomStatus,
  getOneRoomStatus,
  editRoomStatus,
};
