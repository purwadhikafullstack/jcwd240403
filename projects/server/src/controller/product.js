const db = require("../models");
const { dirname } = require("path");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");
const { Op } = require("sequelize");

const getAllProperty = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      location,
      name = "",
      sortBy = "",
      typeRoom = "",
    } = req.query;
    let wheretype = {},
      orderby = ["id", "asc"];
    if (typeRoom) {
      wheretype = {
        property_type_id: typeRoom,
      };
    }
    if (sortBy === "LowestPrice") {
      orderby = [{ model: db.Room }, "base_price", "ASC"];
    }
    if (sortBy === "HighestPrices") {
      orderby = [{ model: db.Room }, "base_price", "DESC"];
    }
    if (sortBy === "A-Z") {
      orderby = ["name", "ASC"];
    }
    if (sortBy === "Z-A") {
      orderby = ["name", "DESC"];
    }

    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 10,
    };
    const { count, rows: data } = await db.Property.findAndCountAll({
      attributes: ["id", "name", "description"],
      where: {
        is_active: true,
        location_id: location,
        deletedAt: null,
        ...wheretype,
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
      },
      limit: pagination.perPage,
      offset: pagination.perPage * (pagination.page - 1),
      distinct: true,
      order: [orderby],
      include: [
        {
          model: db.Picture,
        },
        {
          model: db.Property_type,
        },
        {
          model: db.Location,
        },
        {
          model: db.Room,
          attributes: [
            "id",
            "name",
            "description",
            "base_price",
            "room_img",
            "status",
          ],
          where: {
            status: "AVAILABLE",
            deletedAt: null,
          },
          include: [
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
                [Op.or]: [
                  {
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
                ],
              },
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
        search: name,
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

const getDetailProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, search = "", sortBy = [] } = req.query;
    const getDetail = await db.Property.findOne({
      attributes: ["id", "name", "description"],
      where: {
        id: id,
        deletedAt: null,
      },
      include: [
        {
          model: db.Picture,
        },
        {
          model: db.Property_type,
        },
        {
          model: db.Location,
        },
        {
          model: db.Room,
          attributes: [
            "id",
            "name",
            "description",
            "base_price",
            "room_img",
            "status",
          ],
          where: {
            status: "AVAILABLE",
            deletedAt: null,
            // [Op.or]: [
            //   {
            //     id: {
            //       [Op.notIn]: db.Sequelize.literal(`
            //     SELECT DISTINCT r.id
            //     FROM Rooms AS r
            //     LEFT JOIN Room_statuses AS rs ON r.id = rs.room_id
            //     WHERE (
            //       (rs.start_date <= '${end_date} 23:59:59' AND rs.end_date >= '${start_date} 00:00:00')
            //       OR
            //       (rs.start_date <= '${start_date} 00:00:00' AND rs.end_date >= '${end_date} 23:59:59')
            //     )
            //   `),
            //     },
            //   },
            // ],
          },
          required: false,
          include: [
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
              // where: {
              //   [Op.and]: [
              //     {
              //       [Op.and]: [
              //         {
              //           start_date: {
              //             [Op.gte]: new Date(`${end_date} 23:59:59`),
              //           },
              //         },
              //         {
              //           end_date: {
              //             [Op.gte]: new Date(`${end_date} 23:59:59`),
              //           },
              //         },
              //       ],
              //     },
              //     {
              //       [Op.and]: [
              //         {
              //           start_date: {
              //             [Op.lte]: new Date(`${start_date} 00:00:00`),
              //           },
              //         },
              //         {
              //           end_date: {
              //             [Op.lte]: new Date(`${start_date} 00:00:00`),
              //           },
              //         },
              //       ],
              //     },
              //     {
              //       [Op.and]: [
              //         {
              //           start_date: {
              //             [Op.gt]: new Date(`${end_date} 23:59:59`),
              //           },
              //         },
              //         {
              //           end_date: {
              //             [Op.lt]: new Date(`${start_date} 00:00:00`),
              //           },
              //         },
              //       ],
              //     },
              //   ],
              // },
              where: {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        start_date: {
                          [Op.lt]: new Date(`${start_date} 00:00:00`),
                          [Op.gte]: new Date(`${end_date} 23:59:59`),
                        },
                      },
                      {
                        end_date: {
                          [Op.lte]: new Date(`${start_date} 00:00:00`),
                          [Op.gte]: new Date(`${end_date} 23:59:59`),
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        start_date: {
                          [Op.gte]: new Date(`${end_date} 23:59:59`),
                        },
                      },
                      {
                        end_date: {
                          [Op.lte]: new Date(`${start_date} 00:00:00`),
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    return res.send({
      status: true,
      data: getDetail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const getTopProperty = async (req, res) => {
  try {
    const properties = db.Booking.findAll({
      where: { booking_status: "DONE" },
    });

    res.status(200).send({
      message: "Get top properties success.",
      data: properties,
    });
  } catch (error) {
    console.log("TOP PROPERTY", error);
    error;
  }
};
module.exports = {
  getAllProperty,
  getDetailProperty,
  getTopProperty,
};
