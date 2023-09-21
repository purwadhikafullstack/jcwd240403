const multerMiddleware = require("../middleware/multer");
const router = require("express").Router();
const verifying = require("../middleware/auth");
// const validation = require("../middleware/validation");
const { getAllProperty, getDetailProperty } = require("../controller/product");

router.get(
  "/",
  // verifying.verifyAccessToken,
  // verifying.verifyUser,
  getAllProperty
);
router.get(
  "/:id",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  getDetailProperty
);

module.exports = router;
