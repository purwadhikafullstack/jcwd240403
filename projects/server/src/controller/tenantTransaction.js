const db = require("../models");
const nodemailer = require("nodemailer");
require("dotenv").config();

const getAllOrders = async (req, res) => {
  try {
    const { status, type, location } = req.query;
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 10,
    };
    let whereStatus = {},
      whereType = {},
      whereLocation = {};
    if (status) {
      whereStatus = {
        booking_status: status,
      };
    }
    if (type) {
      whereType = {
        property_type_id: type,
      };
    }
    if (location) {
      whereLocation = {
        location_id: location,
      };
    }
    const { count, rows: data } = await db.Booking.findAndCountAll({
      where: {
        ...whereStatus,
      },
      limit: pagination.perPage,
      offset: pagination.perPage * (pagination.page - 1),
      distinct: true,
      include: [
        {
          model: db.User,
          include: [
            {
              model: db.Profile,
            },
          ],
        },
        {
          model: db.Room,
          required: true,
          include: [
            {
              model: db.Property,
              required: true,
              where: {
                ...whereType,
                ...whereLocation,
              },
              include: [
                {
                  model: db.Property_type,
                },
                {
                  model: db.Location,
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

const confirmPayment = async (req, res) => {
  try {
    const { payment_status } = req.body;
    const { booking_code, user_id } = req.params;
    let message = "";
    const verifyPayment = await db.Booking.update(
      {
        payment_status: payment_status,
      },
      {
        where: {
          booking_code: booking_code,
          user_id: user_id,
        },
      }
    );
    if (payment_status == "ACCEPTED") {
      const getUser = await db.Booking.findOne({
        where: {
          booking_code: booking_code,
          user_id: user_id,
        },
        include: [
          {
            model: db.User,
          },
        ],
      });
      message = "Payment Accepted, Waiting For User Confirmation";
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      let mailOptions = {
        from: process.env.SMTP_USER,
        to: getUser.User.email,
        subject: "Verify Payment",
        text: `Hello,
  
        Welcome to Innsight!
  
        Please click the following link to Verify Your Payment:
  
        http://localhost:3000/verify-payment/${booking_code}-${user_id}
  
  
        Thanks,
        Innsight Team`,
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log("TRANSPORTER_ERR", err, mailOptions);
        } else {
          console.log("Email sent", info);
        }
      });
    }
    if (payment_status == "DECLINED") {
      await db.Booking.update(
        {
          booking_status: "WAITING_FOR_PAYMENT",
        },
        {
          where: {
            booking_code: booking_code,
            user_id: user_id,
          },
        }
      );
      message = "Payment Declined";
    }
    return res.send({
      status: true,
      message: message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const broadcastRules = async (req, res) => {
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
    const { user_id, booking_code } = req.params;
    const cancelThis = await db.Booking.update(
      {
        booking_status: "CANCELED",
      },
      {
        where: {
          user_id: user_id,
          booking_code: booking_code,
        },
      }
    );
    if (cancelThis) {
      return res.send({
        status: true,
        message: "Order Canceled",
      });
    } else {
      return res.send({
        status: false,
        message: "Failed Canceling Order",
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
  getAllOrders,
  confirmPayment,
  broadcastRules,
  cancelOrder,
};
