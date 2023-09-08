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
  checkBooking,
  cancelBookingOrder,
} = require("../controller/userTransaction");
const {
  getAllOrders,
  cancelOrder: cancelUserOrder,
  confirmPayment,
} = require("../controller/tenantTransaction");

// User Transaction

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
  "/cancel/:booking_code",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  cancelBookingOrder
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

router.post(
  "/book/:room_id",
  verifying.verifyAccessToken,
  verifying.verifyUser,
  checkBooking
);

//Tenant Transaction

router.get(
  "/order-user",
  verifying.verifyAccessToken,
  verifying.verifyTenant,
  getAllOrders
);

router.patch(
  "/order-user/:booking_code/:user_id",
  verifying.verifyAccessToken,
  verifying.verifyTenant,
  cancelUserOrder
);

router.post(
  "/order-user/:booking_code/:user_id",
  verifying.verifyAccessToken,
  verifying.verifyTenant,
  confirmPayment
);

module.exports = router;
