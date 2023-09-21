const multerMiddleware = require("../middleware/multer");
const { auth: authController } = require("../controller");
const validation = require("../middleware/validationAuth");
const router = require("express").Router();
const verifying = require("../middleware/auth");

// getFields.any()

router.post(
  "/register",
  multerMiddleware,
  validation.validateRegister,
  authController.register
);

router.post(
  "/login",
  validation.validateLogin,
  verifying.verifySocialToken,
  authController.login
);

router.get(
  "/keep-login",
  verifying.verifyAccessToken,
  authController.keepLogin
);

router.patch(
  "/verification/:token",
  validation.validateVerify,
  authController.verify
);

router.patch("/verify-email/:otp/:email", authController.verify_email);

router.post("/resend-otp", authController.resendOTP);

router.post(
  "/forgot-password",
  validation.validateForgotPassword,
  authController.forgetPassword
);

router.patch(
  "/reset-password",
  validation.validateResetPassword,
  authController.resetPassword
);

module.exports = router;
