const router = require("express").Router();
const { property: propertyController } = require("../controller");
const multerMiddleware = require("../middleware/multerArray");
const authMiddleware = require("../middleware/auth");
const validation = require("../middleware/validationProperty");

router.get(
  "/mine",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.getAllMyProp
);

router.get(
  "/one/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.getOneMyProp
);

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  validation.validateAddProperty,
  propertyController.addProperty
);

router.post(
  "/add-photos",
  multerMiddleware,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  validation.validateAddPropertyPhotos,
  propertyController.addPropPhotos
);

router.patch(
  "/edit-property/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.editProperty
);

router.delete(
  "/delete/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.deleteProperty
);

router.post(
  "/:id/photos",
  multerMiddleware,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.updatePhotos
);

module.exports = router;
