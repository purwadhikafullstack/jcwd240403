const router = require("express").Router();

const { categoryArea: catAreaController } = require("../controller");
const authMiddleware = require("../middleware/auth");
const validation = require("../middleware/validationProperty");

router.get("/all", catAreaController.getAllCatArea);

router.get(
  "/mine",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  catAreaController.getAllMyCatArea
);

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  validation.validateAddCategoryArea,
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
  validation.validateEditCategoryArea,
  catAreaController.editMyCatArea
);

router.delete(
  "/delete/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  catAreaController.deleteMyPropertyType
);
module.exports = router;
