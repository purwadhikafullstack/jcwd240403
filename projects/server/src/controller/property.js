const db = require("../models");

module.exports = {
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
      let imageURL = "";

      if (req.files) {
        imageURL = setFromFileNameToDBValue(req.files.filename);
        console.log(imageURL);
      }
      const result = await db.Picture.create({
        property_id: propId,
        img: imageURL,
      });
      res.send(200).status({
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
