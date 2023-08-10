var multer = require("multer");
var getFields = multer();

const upload = require("../middleware/multer");
const { auth: authController } = require("../controller");
const validation = require("../middleware/validation");
const router = require("express").Router();

// getFields.any()

router.post(
  "/register",
  upload.single("file"),
  validation.validateRegister,
  authController.register
);

router.post("/login", validation.validateLogin, authController.login);

module.exports = router;
