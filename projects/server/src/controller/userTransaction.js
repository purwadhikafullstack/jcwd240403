const { Op } = require("sequelize");
const db = require("../models");
const { setFromFileNameToDBValue } = require("../utils/file");

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
          required: false,
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
    const { room_id, check_in_date, check_out_date, total_invoice } = req.body;
    const booking_status = "WAITING_FOR_PAYMENT";
    const booking_code = `${await alphabetRandom()}${Math.floor(
      1000 + Math.random() * 9000
    ).toString()}${await alphabetRandom()}`;
    const dateInConvertion = new Date(check_in_date).getTime();
    const dateOutConvertion = new Date(check_out_date).getTime();
    const timeDiff = dateOutConvertion - dateInConvertion;
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const price = total_invoice / days;
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
      // await db.Room_status.create({
      //   room_id: room_id,
      //   custom_status: "Booked",
      //   start_date: check_in_date,
      //   end_date: check_out_date,
      // });
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

const bookPropertyDetail = async (req, res) => {
  try {
    const { booking_code } = req.params;
    const token = req.user;
    const user_id = token.id;
    const getData = await db.Booking.findOne({
      where: {
        booking_code: booking_code,
        user_id: user_id,
      },
    });
    return res.send({
      status: true,
      data: getData,
    });
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
    const token = req.user;
    const user_id = token.id;
    const { booking_code } = req.params;
    const imageUrl = setFromFileNameToDBValue(req.file?.filename);
    if (imageUrl) {
      const uploadProof = await db.Booking.update(
        {
          payment_proof: imageUrl,
          booking_status: "PROCESSING_PAYMENT",
        },
        {
          where: {
            user_id: user_id,
            booking_code: booking_code,
          },
        }
      );
      if (uploadProof) {
        return res.send({
          status: true,
          message: "Payment Proof Uploaded",
        });
      } else {
        return res.send({
          status: false,
          message: "Failed Uploading Payment Proof",
        });
      }
    } else {
      return res.send({
        status: false,
        message: "Payment Proof Not Found",
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

const cancelBookingOrder = async (req, res) => {
  try {
    const token = req.user;
    const user_id = token.id;
    const { booking_code } = req.params;
    const cancelThis = await db.Booking.update(
      {
        booking_status: "CANCELED",
      },
      {
        where: {
          booking_code: booking_code,
          user_id: user_id,
        },
      }
    );
    return res.send({
      status: true,
      data: cancelThis,
      message: "Order Has Been Canceled",
    });
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
    const token = req.user;
    const user_id = token.id;
    const { date, booking_code = "", booking_status, sortBy = "" } = req.query;
    let whereDate = {};
    if (date) {
      whereDate = {
        [Op.or]: [
          {
            check_in_date: date,
          },
          {
            check_out_date: date,
          },
        ],
      };
    }
    let orderby = ["id", "asc"];
    if (sortBy === "LowestPrice") {
      orderby = ["total_invoice", "ASC"];
      // orderby = [{ model: db.Booking }, "total_invoice", "ASC"];
    }
    if (sortBy === "HighestPrice") {
      orderby = ["total_invoice", "DESC"];
      // orderby = [{ model: db.Booking }, "total_invoice", "DESC"];
    }
    if (sortBy === "A-Z") {
      orderby = [{ model: db.Room }, { model: db.Property }, "name", "ASC"];
    }
    if (sortBy === "Z-A") {
      orderby = [{ model: db.Room }, { model: db.Property }, "name", "DESC"];
    }
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 10,
    };
    const { count, rows: data } = await db.Booking.findAndCountAll({
      where: {
        user_id: user_id,
        booking_code: {
          [Op.like]: `%${booking_code}%`,
        },
        booking_status: {
          [Op.like]: `%${booking_status}%`,
        },
        ...whereDate,
      },
      limit: pagination.perPage,
      offset: pagination.perPage * (pagination.page - 1),
      distinct: true,
      order: [orderby],
      include: [
        {
          model: db.Room,
          include: [
            {
              model: db.Property,
              include: [
                {
                  model: db.Location,
                },
                {
                  model: db.Property_type,
                },
              ],
            },
          ],
        },
      ],
    });
    const totalPage = Math.ceil(count / pagination.perPage);
    return res.send({
      status: true,
      data: data,
      pagination: {
        page: pagination.page,
        perPage: pagination.perPage,
        totalData: count,
        totalPage: totalPage,
      },
    });
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
    const token = req.user;
    const user_id = token.id;
    const { booking_code } = req.params;
    const cancelThis = await db.Booking.destroy({
      where: {
        user_id: user_id,
        booking_code: booking_code,
      },
    });
    return res.send({
      status: true,
      message: "Order Deleted",
      data: cancelThis,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const checkBooking = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const { room_id } = req.params;
    const checkBooked = await db.Booking.findOne({
      where: {
        room_id: room_id,
        [Op.or]: [
          {
            check_in_date: start_date,
          },
          {
            check_out_date: end_date,
          },
        ],
      },
    });
    if (checkBooked) {
      return res.send({
        status: false,
        message: "Room Already Booked",
      });
    } else {
      return res.send({
        status: true,
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

const verifyPayment = async (req, res) => {
  try {
    const token = req.user;
    const user_id = token.id;
    const { booking_code } = req.params;
    const userId = req.body.user_id;
    if (userId == user_id) {
      const verify = await db.Booking.update(
        {
          booking_status: "DONE",
        },
        {
          where: {
            user_id: user_id,
            booking_code: booking_code,
          },
        }
      );
      if (verify) {
        return res.send({
          status: true,
          message: "Payment Verified Successfully",
        });
      } else {
        return res.send({
          status: false,
          message: "Payment Verify Failed",
        });
      }
    } else {
      return res.send({
        status: false,
        message: "User And Credential Does Not Match",
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

module.exports = {
  bookProperty,
  uploadPaymentProof,
  getAllOrder,
  cancelOrder,
  getThisRoom,
  bookPropertyDetail,
  checkBooking,
  cancelBookingOrder,
  verifyPayment,
};
