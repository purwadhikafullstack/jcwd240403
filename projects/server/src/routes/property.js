const router = require("express").Router();
const { property: propertyController } = require("../controller");
const multerMiddleware = require("../middleware/multer");
const authMiddleware = require("../middleware/auth");

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.addProperty
);

router.post(
  "/add-photos",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.addPropPhotos
);

module.exports = router;
