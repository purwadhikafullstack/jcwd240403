const db = require("../models");
const moment = require("moment-timezone");

module.exports = {
  async addRoomStatus(req, res) {
    try {
      const { roomId, customStatus, startDate, endDate } = req.body;

      const searchRoom = await db.Room.findOne({
        where: {
          id: roomId,
        },
      });

      if (!searchRoom) {
        return res.status(400).send({
          message: "Room not found",
        });
      }

      const result = await db.Room_status.create({
        room_id: roomId,
        custom_status: customStatus,
        start_date: moment(startDate)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        end_date: moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        is_active: true,
      });
      res.status(201).send({
        message: "Success add room status",
        data: result,
      });
    } catch (error) {
      console.log("addRommStatus", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async getAllRoomStatus(req, res) {
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
                model: db.Room_status,
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
      }));
      console.log("TEST ROOM STATUS", property.Rooms);

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
  },

  async getOneRoomStatus(req, res) {
    try {
      const id = req.params.id;
      const result = await db.Room_status.findOne({
        where: { id: id },
        include: [{ model: db.Room }],
      });
      if (!result) {
        return res.status(400).send({
          message: "No room status data found",
        });
      }

      res.status(200).send({
        message: "Success get one room status data",
        data: result,
      });
    } catch (error) {
      console.log("get one room status", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async editRoomStatus(req, res) {
    try {
      const id = req.params.id;
      const { customStatus, startDate, endDate, isActive } = req.body;

      const isExist = await db.Room_status.findOne({
        where: { id: id },
      });
      if (!isExist) {
        return res.status(400).send({
          message: "Room status data not found",
        });
      }

      const updatePrice = await db.Room_status.update(
        {
          custom_status: customStatus,
          start_date: moment(startDate)
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
          end_date: moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
          is_active: isActive,
        },
        { where: { id: id } }
      );

      const updated = await db.Room_status.findOne({
        where: { id: id },
      });

      res.status(201).send({
        message: "Success edit room status",
        data: updated,
      });
    } catch (error) {
      console.log("edit room status", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },
};