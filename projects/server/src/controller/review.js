const db = require("../models");

const review = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};
