const db = require("../models");
const nodemailer = require("nodemailer");
require("dotenv").config();
const moment = require("moment-timezone");

const getAllOrders = async (req, res) => {
  try {
    const token = req.user;
    const user_id = token.id;
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
                user_id: user_id,
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

const getFilter = async (req, res) => {
  try {
    const status = [
      {
        id: "",
        value: "All",
      },
      {
        id: "WAITING_FOR_PAYMENT",
        value: "WAITING FOR PAYMENT",
      },
      {
        id: "PROCESSING_PAYMENT",
        value: "PROCESSING PAYMENT",
      },
      {
        id: "DONE",
        value: "DONE",
      },
      {
        id: "CANCELED",
        value: "CANCELED",
      },
    ];
    const location = await db.Location.findAll();
    const propertyType = await db.Property_type.findAll();
    return res.send({
      status: true,
      data: {
        status: status,
        location: location,
        propertyType: propertyType,
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
    const {
      payment_status,
      cancel_reason = null,
      reject_reason = null,
    } = req.body;
    const { booking_code, user_id } = req.params;
    let message = "";

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    let mailOptions = {};
    const getUser = await db.Booking.findOne({
      where: {
        booking_code: booking_code,
        user_id: user_id,
      },
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
          ],
        },
      ],
    });

    const verifyPayment = await db.Booking.update(
      {
        payment_status: payment_status,
        cancel_reason: cancel_reason,
        reject_reason: reject_reason,
      },
      {
        where: {
          booking_code: booking_code,
          user_id: user_id,
        },
      }
    );
    if (payment_status == "ACCEPTED") {
      await db.Booking.update(
        {
          booking_status: "DONE",
        },
        {
          where: {
            booking_code: booking_code,
            user_id: user_id,
          },
        }
      );
      message = "Payment Accepted, Waiting For User Confirmation";
      mailOptions = {
        from: process.env.SMTP_USER,
        to: getUser.User.email,
        subject: "Booking Detail",
        text: `Hello,
  
        Welcome to Innsight!
        
        Your Transaction was Accepted, Here is Your Booking Detail :

        Name : ${getUser.User.Profile.full_name}
        Booking Code : ${getUser.booking_code}
        Check in Date : ${moment(getUser.check_in_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        )}
        Check Out Date : ${moment(getUser.check_out_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        )}
        Property Name : ${getUser.Room.Property.name}
        Property Type : ${getUser.Room.Property.Property_type.name}
        Room : ${getUser.Room.name}
        Total : ${new Intl.NumberFormat().format(getUser.total_invoice)}
        
  
  
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
      message = "Payment Declined";
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

      mailOptions = {
        from: process.env.SMTP_USER,
        to: getUser.User.email,
        subject: message,
        text: `Hello,
  
        Welcome to Innsight!
        
        Your Transaction was Declined, the Reason Is Below Here:

       ${reject_reason}

       Please Visit This Link 
       http://localhost:3000/orderlist
  
  
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
    const { cancel_reason = null } = req.body;
    const cancelThis = await db.Booking.update(
      {
        booking_status: "CANCELED",
        cancel_reason: cancel_reason,
      },
      {
        where: {
          user_id: user_id,
          booking_code: booking_code,
        },
      }
    );
    const getUser = await db.Booking.findOne({
      where: {
        booking_code: booking_code,
        user_id: user_id,
      },
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
          ],
        },
      ],
    });
    if (cancelThis) {
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
        subject: "Transaction Canceled",
        text: `Hello,
  
        Welcome to Innsight!
        
        Your Transaction was Canceled, the Reason Is Below Here:

       ${cancel_reason}

       Please Visit This Link 
       http://localhost:3000/orderlist
  
  
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
  getFilter,
};
