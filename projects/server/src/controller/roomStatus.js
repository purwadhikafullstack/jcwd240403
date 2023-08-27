const db = require("../models");

module.exports = {
  async addRoomStatus(req, res) {
    try {
      const { roomId, customStatus, startDate, endDate } = req.body;

      const searchRoom = await db.Room.findOne({
        where: {
          room_id: roomId,
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
        start_date: startDate,
        end_date: endDate,
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
  },
};
