const db = require("../models");

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
    let price = dataRoom.Special_price?.price ?? dataRoom.base_price;
    const booking_status = "WAITING_FOR_PAYMENT";
    const booking_code = `B-${user_id}-${room_id}-${
      check_in_date.split("T")[0]
    }`;
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
};
