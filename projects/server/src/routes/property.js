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
  propertyController.addProperty
);

router.post(
  "/add-photos",
  multerMiddleware,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.addPropPhotos
);

router.patch(
  "/edit-property/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.editProperty
);

router.patch(
  "/edit-photos/:id",
  multerMiddleware,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.editPropPhotos
);

router.delete(
  "/property/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propertyController.deleteProperty
);

module.exports = router;
