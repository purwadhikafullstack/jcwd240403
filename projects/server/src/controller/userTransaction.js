const { Op } = require("sequelize");
const db = require("../models");

const alphabetRandom = async () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
  return randomCharacter;
};
const getThisRoom = async (req, res) => {
  try {
    const { room_id, start_date, end_date } = req.query;
    const dataRoom = await db.Room.findOne({
      where: {
        id: room_id,
        status: "AVAILABLE",
        deletedAt: null,
      },
      required: false,
      include: [
        {
          model: db.Property,
          include: [
            {
              model: db.Property_type,
            },
            {
              model: db.Location,
            },
          ],
        },
        {
          model: db.Special_price,
          where: {
            [Op.or]: [
              {
                start_date: {
                  [Op.between]: [
                    new Date(`${start_date} 00:00:00`),
                    new Date(`${end_date} 23:59:59`),
                  ],
                },
              },
              {
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
            ],
          },
          required: false,
        },
        {
          model: db.Room_status,
          attributes: ["id", "start_date", "end_date"],
          where: {
            [Op.not]: [
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
    });
    return res.send({
      status: true,
      data: dataRoom,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const bookProperty = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { room_id, check_in_date, check_out_date } = req.body;
    const dataRoom = await db.Room.findOne({
      where: {
        id: room_id,
      },
      include: [
        {
          model: db.Special_price,
        },
      ],
    });
    let price = dataRoom.base_price;
    const booking_status = "WAITING_FOR_PAYMENT";
    const booking_code = `${await alphabetRandom()}${Math.floor(
      1000 + Math.random() * 9000
    ).toString()}${await alphabetRandom()}`;
    const dateInConvertion = new Date(check_in_date).getTime();
    const dateOutConvertion = new Date(check_out_date).getTime();
    const timeDiff = dateOutConvertion - dateInConvertion;
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const total_invoice = days * price;
    const bookingTransaction = await db.Booking.create({
      user_id: user_id,
      room_id: room_id,
      check_in_date: check_in_date,
      check_out_date: check_out_date,
      price: price,
      booking_code: booking_code,
      total_invoice: total_invoice,
      booking_status: booking_status,
    });
    if (bookingTransaction) {
      return res.send({
        status: true,
        message: "Property Booked Successfully",
        data: bookingTransaction,
      });
    } else {
      return res.send({
        status: false,
        message: "Property Failed To Book, Please Try Again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const uploadPaymentProof = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

module.exports = {
  bookProperty,
  uploadPaymentProof,
  getAllOrder,
  cancelOrder,
  getThisRoom,
};
