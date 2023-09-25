const { Op } = require("sequelize");
const db = require("../models");

const getAllReport = async (req, res) => {
  try {
    const token = req.user;
    const user_id = token.id;
    const { start_date, end_date, sortBy = [] } = req.query;

    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 10,
    };
    let whereDate = {},
      order = [];
    if (start_date && end_date) {
      whereDate = {
        check_in_date: {
          [Op.between]: [start_date, end_date],
        },
        check_out_date: {
          [Op.between]: [start_date, end_date],
        },
      };
    }
    if (sortBy.toUpperCase() == "CHECKINOLDEST") {
      order = ["check_in_date", "asc"];
    }
    if (sortBy.toUpperCase() == "CHECKINLATEST") {
      order = ["check_in_date", "desc"];
    }
    if (sortBy.toUpperCase() == "CHECKOUTOLDEST") {
      order = ["check_out_date", "asc"];
    }
    if (sortBy.toUpperCase() == "CHECKOUTLATEST") {
      order = ["check_out_date", "desc"];
    }
    if (sortBy.toUpperCase() == "TOTALHIGHEST") {
      order = ["total_invoice", "desc"];
    }
    if (sortBy.toUpperCase() == "TOTALLOWEST") {
      order = ["total_invoice", "asc"];
    }
    const { count, rows: data } = await db.Booking.findAndCountAll({
      where: {
        ...whereDate,
        booking_status: "DONE",
      },
      limit: pagination.perPage,
      offset: pagination.perPage * (pagination.page - 1),
      distinct: true,
      order: [order],
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
              where: {
                user_id: user_id,
              },
              include: [
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

const getAllReportByDate = async (req, res) => {
  try {
    const token = req.user;
    const user_id = token.id;
    const { date } = req.params;
    let whereDateBooking = {
      [Op.and]: [
        {
          check_in_date: {
            [Op.lte]: new Date(date),
          },
        },
        {
          check_out_date: {
            [Op.gte]: new Date(date),
          },
        },
      ],
    };
    let whereDateStatus = {
      [Op.and]: [
        {
          start_date: {
            [Op.lte]: new Date(date),
          },
        },
        {
          end_date: {
            [Op.gte]: new Date(date),
          },
        },
      ],
    };
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 10,
    };
    const { count, rows: tmpdata } = await db.Room.findAndCountAll({
      where: {
        deletedAt: null,
      },
      limit: pagination.perPage,
      offset: pagination.perPage * (pagination.page - 1),
      distinct: true,
      include: [
        {
          model: db.Property,
          where: {
            user_id: user_id,
            deletedAt: null,
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
        {
          model: db.Room_status,
          where: {
            ...whereDateStatus,
          },
          required: false,
        },
        {
          model: db.Booking,
          where: {
            ...whereDateBooking,
          },
          required: false,
        },
      ],
    });
    const data = tmpdata.map((row) => {
      let status = "Room Available";
      if (row.Room_statuses?.length) {
        status = "Room Cant be Used";
      }
      if (row.Bookings.find((rb) => rb.booking_status == "DONE")) {
        status = "Booked";
      }
      return { ...row.toJSON(), status: status };
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

module.exports = {
  getAllReport,
  getAllReportByDate,
};
