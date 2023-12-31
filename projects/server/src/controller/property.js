const db = require("../models");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");
const Op = db.Sequelize.Op;

const getAllMyProp = async (req, res) => {
  try {
    const userId = req.user.id;
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 10,
    };

    const { sortBy, filter, filterType } = req.query;

    let order = [];
    let whereFilter = {};
    let whereType = {};

    if (filter) {
      whereFilter = { location_id: filter };
    }

    if (filterType) {
      whereType = { property_type_id: filterType };
    }

    switch (sortBy) {
      case "nameDesc":
        order = [["name", "DESC"]];
        break;
      case "nameAsc":
        order = [["name", "ASC"]];
        break;
      default:
        order = [["createdAt", "DESC"]];
        break;
    }

    const result = await db.Property.findAll({
      where: { user_id: userId, deletedAt: null, ...whereFilter, ...whereType },
      order,
      include: [
        {
          model: db.Location,
          attributes: ["id", "city"],
        },
        {
          model: db.Category_area,
          attributes: ["id", "name"],
        },
        {
          model: db.Property_type,
          attributes: ["id", "name"],
        },
        {
          model: db.Picture,
          attributes: ["id", "property_id", "img"],
        },
      ],
      limit: pagination.perPage,
      offset: (pagination.page - 1) * pagination.perPage,
    });

    if (result.length === 0) {
      return res.status(200).send({
        message: "You haven't list any property yet.",
      });
    }

    const countData = await db.Property.count({
      where: { user_id: userId, deletedAt: null, ...whereFilter, ...whereType },
    });
    pagination.totalData = countData;
    const totalPage = Math.ceil(pagination.totalData / pagination.perPage);
    pagination.totalPage = totalPage;

    res.status(200).send({
      message: "Success get all my property",
      pagination: {
        page: pagination.page,
        perPage: pagination.perPage,
        totalData: pagination.totalData,
        totalPage: pagination.totalPage,
      },
      data: result,
    });
  } catch (error) {
    console.log("getall", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const getOneMyProp = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const result = await db.Property.findOne({
      where: { id: id, user_id: userId, deletedAt: null },
      include: [
        {
          model: db.Location,
          attributes: ["id", "city"],
        },
        {
          model: db.Category_area,
          attributes: ["id", "name"],
        },
        {
          model: db.Property_type,
          attributes: ["id", "name"],
        },
        {
          model: db.Picture,
          attributes: ["id", "property_id", "img"],
        },
      ],
    });

    if (!result) {
      return res.status(200).send({
        message: "Property not found.",
      });
    }
    res.status(200).send({
      message: "Success get your property.",
      data: result,
    });
  } catch (error) {
    console.log("GET ONE PROPERTY", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const addProperty = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const { name, locationId, propTypeId, catAreaId, description } = req.body;

    const newProperty = await db.Property.create(
      {
        user_id: userId,
        property_type_id: Number(propTypeId),
        location_id: Number(locationId),
        category_area_id: Number(catAreaId),
        name: name,
        location_id: locationId,
        property_type_id: propTypeId,
        category_area_id: catAreaId,
        description: description,
        is_active: true,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(200).send({
      message: "Success creating property.",
      data: newProperty,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("addprop", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const addPropPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propId } = req.body;
    const property = await db.Property.findOne({
      where: { id: propId, user_id: userId },
    });
    if (!property) {
      return res.status(400).send({ message: "No property found" });
    }

    let images = req.files.map((file) => ({
      img: setFromFileNameToDBValue(file.filename),
      property_id: propId,
    }));
    console.log(images);
    const result = await db.Picture.bulkCreate(images);

    res.status(200).send({
      message: "Adding photos to property success",
      data: result,
    });
  } catch (error) {
    console.log("addphotos", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

const editProperty = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { name, locationId, propTypeId, catAreaId, description } = req.body;

    const result = await db.Property.findOne({
      where: { user_id: userId, id: id },
    });
    if (!result) {
      return res.status(400).send({ message: "Property doesn't exist." });
    }

    const editProp = await db.Property.update(
      {
        name: name,
        location_id: locationId,
        property_type_id: propTypeId,
        category_area_id: catAreaId,
        description: description,
      },
      { where: { user_id: userId, id: id }, transaction }
    );

    await transaction.commit();

    const edited = await db.Property.findOne({
      where: { id: id, user_id: userId },
    });

    res.status(200).send({
      message: "Success update property",
      data: edited,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("editprop", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

const updatePhotos = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const propId = req.params.id;
    let imageIds;
    let images;

    if (req.files) {
      images = req.files.map((file) => ({
        img: setFromFileNameToDBValue(file.filename),
        property_id: propId,
      }));
      const result = await db.Picture.bulkCreate(images, { transaction });
    }

    if (req.body.ids) {
      imageIds = req.body.ids.split(",").map((id) => Number(id));
      console.log("length", imageIds.length);
      for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        const deleteImg = await db.Picture.findOne({
          where: {
            id: imageId,
            property_id: propId,
          },
          transaction,
        });

        if (!deleteImg) {
          await transaction.rollback();
          return res.status(400).send({
            message: "Photo not found.",
          });
        }

        const oldImage = deleteImg.getDataValue("img");
        // console.log("OLD IMAGE PATH", oldImage);
        const oldImageFile = getFilenameFromDbValue(oldImage);
        // console.log("OLD IMAGE", oldImageFile);
        const coba = getAbsolutePathPublicFile(oldImageFile);
        console.log("COBA", coba);
        // imageRecord.img = setFromFileNameToDBValue(req.files[i].filename);

        if (deleteImg) {
          fs.unlinkSync(getAbsolutePathPublicFile(oldImageFile));
          await deleteImg.destroy({ transaction });
        }
      }
    }

    await transaction.commit();

    const pictures = await db.Picture.findAll({
      where: { property_id: propId },
    });

    res.status(200).send({
      message: "Success update photos",
      data: pictures,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("updatephotos", error);
    res.status(500).send({
      message: "Something wrong on serever",
      error,
    });
  }
};

const deleteProperty = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;
    const property = await db.Property.findOne({
      where: { id: id, user_id: userId, deletedAt: null },
    });

    if (!property) {
      return res.status(200).send({
        message: "Property not found.",
      });
    }

    const deleteNow = await db.Property.destroy({
      where: { id: id, user_id: userId },
      transaction,
    });

    await db.Room.destroy({
      where: { property_id: id },
      transaction,
    });

    await transaction.commit();

    res.status(200).send({
      message: "Success delete property",
      deleted: property,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("deleteprop", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

module.exports = {
  getAllMyProp,
  getOneMyProp,
  addProperty,
  addPropPhotos,
  editProperty,
  updatePhotos,
  deleteProperty,
};
