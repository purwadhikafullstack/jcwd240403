const router = require("express").Router();
const { specialPrice: priceController } = require("../controller");
const authMiddleware = require("../middleware/auth");

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  priceController.addSpecialPrice
);

router.get(
  "/all/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  priceController.getAllSpecialPrice
);

module.exports = router;
