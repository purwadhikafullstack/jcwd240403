const router = require("express").Router();

const { propertyType: propTypeController } = require("../controller");
const authMiddleware = require("../middleware/auth");

router.get("/all", propTypeController.getAllPropType);

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propTypeController.addPropertyType
);

router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propTypeController.getOneMyPropType
);

router.patch(
  "/edit/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propTypeController.editMyPropType
);

router.delete(
  "/delete/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  propTypeController.deleteMyPropertyType
);
module.exports = router;
