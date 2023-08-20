const db = require("../models");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");

module.exports = {
  async getAllMyProp(req, res) {
    try {
      const userId = req.user.id;
      const result = await db.Property.findAll({
        where: { user_id: userId },
        include: {
          model: db.Location,
        },
      });
      res.status(200).send({
        message: "Success get all my property",
        data: result,
      });
    } catch (error) {
      console.log("getall", error);
      res.status(500).send({
        message: "Something wrong on server",
      });
    }
  },

  async addProperty(req, res) {
    try {
      const userId = req.user.id;
      const { name, locationId, propTypeId, catAreaId, description } = req.body;

      const newProperty = await db.Property.create({
        user_id: userId,
        property_type_id: Number(propTypeId),
        location_id: Number(locationId),
        category_area_id: Number(catAreaId),
        name: name,
        description: description,
      });

      res.status(200).send({
        message: "Success creating property",
        data: newProperty,
      });
    } catch (error) {
      console.log("addprop", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async addPropPhotos(req, res) {
    try {
      // const userId = req.user.id;
      const { propId } = req.body;
      const property = await db.Property.findByPk(propId);
      if (!property) {
        return res.status(400).send({ message: "Invalid propId provided" });
      }

      let images = req.files.map((file) => ({
        img: setFromFileNameToDBValue(file.filename),
        property_id: Number(propId),
      }));

      const result = await db.Picture.bulkCreate(images);

      console.log("images", images);

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
  },

  async editProperty(req, res) {
    try {
    } catch (error) {}
  },

  async editPropPhotos(req, res) {
    try {
    } catch (error) {}
  },

  async deleteProperty(req, res) {
    try {
    } catch (error) {}
  },
};
