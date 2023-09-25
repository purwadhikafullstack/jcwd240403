const router = require("express").Router();
const { specialPrice: priceController } = require("../controller");
const authMiddleware = require("../middleware/auth");
const validation = require("../middleware/validationProperty");

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  validation.validateCreateSpecialPrice,
  priceController.addSpecialPrice
);

router.get(
  "/all/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  priceController.getAllSpecialPrice
);

router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  priceController.getOneSpecialPrice
);

router.patch(
  "/edit/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  priceController.editSpecialPrice
);

module.exports = router;
