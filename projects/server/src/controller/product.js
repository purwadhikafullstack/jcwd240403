const db = require("../models");
const { dirname } = require("path");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");
const Op = db.Sequelize.Op;

const getAllProperty = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      location,
      search = "",
      sortBy = [],
    } = req.query;
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
      },
      limit: pagination.perPage,
      offset: pagination.perPage * (pagination.page - 1),
      distinct: true,
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
                [Op.and]: [
                  {
                    start_date: {
                      [Op.or]: [
                        {
                          [Op.lte]: new Date(`${start_date} 00:00:00`),
                        },
                        {
                          [Op.gte]: new Date(`${start_date} 00:00:00`),
                        },
                      ],
                    },
                  },
                  {
                    end_date: {
                      [Op.or]: [
                        {
                          [Op.gte]: new Date(`${end_date} 23:59:59`),
                        },
                        {
                          [Op.lte]: new Date(`${end_date} 23:59:59`),
                        },
                      ],
                    },
                  },
                ],
              },
              required: false,
            },
            {
              model: db.Room_status,
              attributes: ["id", "start_date", "end_date"],
              where: {
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
        search: search,
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
          },
          required: false,
          include: [
            {
              model: db.Special_price,
              where: {
                [Op.and]: [
                  {
                    start_date: {
                      [Op.or]: [
                        {
                          [Op.lte]: new Date(`${start_date} 00:00:00`),
                        },
                        {
                          [Op.gte]: new Date(`${start_date} 00:00:00`),
                        },
                      ],
                    },
                  },
                  {
                    end_date: {
                      [Op.or]: [
                        {
                          [Op.gte]: new Date(`${end_date} 23:59:59`),
                        },
                        {
                          [Op.lte]: new Date(`${end_date} 23:59:59`),
                        },
                      ],
                    },
                  },
                ],
              },
              required: false,
            },
            {
              model: db.Room_status,
              attributes: ["id", "start_date", "end_date"],
              where: {
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
              required: false,
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

module.exports = {
  getAllProperty,
  getDetailProperty,
};
