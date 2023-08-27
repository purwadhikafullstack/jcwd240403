const router = require("express").Router();
const { roomStatus: statusController } = require("../controller");
const authMiddleware = require("../middleware/auth");

router.post(
  "/create",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  statusController.addRoomStatus
);

router.get(
  "/all/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  statusController.getAllRoomStatus
);

router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  statusController.getOneRoomStatus
);

router.patch(
  "/edit/:id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyTenant,
  statusController.editRoomStatus
);

module.exports = router;
