const db = require("../models");

module.exports = {
  async getAllLocation(req, res) {
    try {
      const result = await db.Location.findAll();
      res.status(200).send({
        message: "Success get all locations",
        data: result,
      });
    } catch (error) {
      console.log("allLoc", error);
      res.status(500).send({
        message: "Something wrong on server",
      });
    }
  },

  async getAllPropType(req, res) {
    try {
      const result = await db.Property_type.findAll();
      res.status(200).send({
        message: "Success get all property type",
        data: result,
      });
    } catch (error) {
      console.log("allproptype", error);
      res.status(500).send({
        message: "Something wrong on server",
      });
    }
  },
};
