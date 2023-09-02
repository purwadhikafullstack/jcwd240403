const multerMiddleware = require("../middleware/multer");
const router = require("express").Router();
const verifying = require("../middleware/auth");
const validation = require("../middleware/validation");
const {
  bookProperty,
  getThisRoom,
  bookPropertyDetail,
  cancelOrder,
  uploadPaymentProof,
  getAllOrder,
} = require("../controller/userTransaction");

router.get(
  "/book",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  getThisRoom
);
router.get(
  "/book/:booking_code",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  bookPropertyDetail
);

router.post(
  "/book",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  bookProperty
);
router.delete(
  "/book/:booking_code",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  cancelOrder
);

router.patch(
  "/book/:booking_code",
  verifying.verifyAccessToken,
  multerMiddleware,
  verifying.verifyUser,
  uploadPaymentProof
);

router.get(
  "/order",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  getAllOrder
);
module.exports = router;
