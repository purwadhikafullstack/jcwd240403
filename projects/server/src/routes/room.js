const router = require("express").Router();
const { room: roomController } = require("../controller");
const authMiddleware = require("../middleware/auth");
const multerMiddleware = require("../middleware/multer");

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  multerMiddleware,
  roomController.createRoom
);

router.get(
  "/all",
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

module.exports = router;
