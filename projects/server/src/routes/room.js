const router = require("express").Router();
const { room: roomController } = require("../controller");
const authMiddleware = require("../middleware/auth");
const multerMiddleware = require("../middleware/multer");
const validation = require("../middleware/validationProperty");

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  multerMiddleware,
  validation.validateAddRoom,
  roomController.createRoom
);

router.get(
  "/all/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  roomController.getAllRoom
);

router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  roomController.getOneRoom
);

router.patch(
  "/edit/:id",
  multerMiddleware,
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  roomController.updateRoom
);

router.delete(
  "/delete/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  roomController.deleteRoom
);

module.exports = router;
