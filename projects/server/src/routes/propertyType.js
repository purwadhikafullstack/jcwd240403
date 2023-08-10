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

module.exports = router;