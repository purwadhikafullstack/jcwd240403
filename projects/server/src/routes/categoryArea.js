const router = require("express").Router();

const { categoryArea: catAreaController } = require("../controller");
const authMiddleware = require("../middleware/auth");

router.get("/all", catAreaController.getAllCatArea);

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  catAreaController.addCatArea
);

router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  catAreaController.getOneMyCatArea
);

router.patch(
  "/edit/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  catAreaController.editMyCatArea
);

router.delete(
  "/delete/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  catAreaController.deleteMyPropertyType
);
module.exports = router;
