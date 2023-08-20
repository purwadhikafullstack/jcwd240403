const router = require("express").Router();
const { property: propertyController } = require("../controller");
const multerMiddleware = require("../middleware/multerArray");
const authMiddleware = require("../middleware/auth");

router.get(
  "/mine",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.getAllMyProp
);

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.addProperty
);

router.post(
  "/add-photos",
  multerMiddleware,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.addPropPhotos
);

module.exports = router;
