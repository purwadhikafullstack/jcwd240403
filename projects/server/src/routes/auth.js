var multer = require("multer");
var getFields = multer();

const { auth: authController } = require("../controller");
const router = require("express").Router();

router.post("/register", getFields.any(), authController.register);

module.exports = router;
