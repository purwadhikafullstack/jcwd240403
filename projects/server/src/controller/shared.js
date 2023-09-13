const db = require("../models");

const getAllLocation = async (req, res) => {
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
};

const getAllPropType = async (req, res) => {
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
};

module.exports = {
  getAllLocation,
  getAllPropType,
};
