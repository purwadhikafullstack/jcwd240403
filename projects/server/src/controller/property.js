const db = require("../models");

module.exports = {
  async addProperty(req, res) {
    try {
      const userId = req.user.id;
      const { name, locationId, propTypeId, catAreaId, description } = req.body;
      let imageURL = "";

      if (req.file) {
        imageURL = setFromFileNameToDBValue(req.file.filename);
        console.log(imageURL);
      }

      const newProperty = await db.Property.create({
        user_id: userId,
        property_type_id: propTypeId,
        location_id: locationId,
        category_area_id: catAreaId,
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
};
