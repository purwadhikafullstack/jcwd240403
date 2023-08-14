const multerMiddleware = require("../middleware/multer");
const { auth: authController } = require("../controller");
const validation = require("../middleware/validation");
const router = require("express").Router();
const verifying = require("../middleware/auth");

// getFields.any()

router.post(
  "/register",
  multerMiddleware,
  validation.validateRegister,
  authController.register
);

router.post("/login", validation.validateLogin, authController.login);

router.patch(
  "/verification/:token",
  validation.validateVerify,
  authController.verify
);

router.post(
  "/resend-otp",
  verifying.verifyAccessToken,
  authController.resendOTP
);
router.get(
  "/loginWithToken",
  verifying.verifyAccessToken,
  authController.loginWithToken
);
module.exports = router;
