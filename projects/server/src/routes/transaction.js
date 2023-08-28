const multerMiddleware = require("../middleware/multer");
const router = require("express").Router();
const verifying = require("../middleware/auth");
const validation = require("../middleware/validation");
const { bookProperty } = require("../controller/userTransaction");

router.post(
  "/book",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  bookProperty
);

module.exports = router;
