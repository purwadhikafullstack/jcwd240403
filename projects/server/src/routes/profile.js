const multerMiddleware = require("../middleware/multer");
const router = require("express").Router();
const verifying = require("../middleware/auth");
const validation = require("../middleware/validationAuth");
const {
  getUser,
  updateProfile,
  updateProfilePicture,
  changePassword,
} = require("../controller/profile");

router.get("/", verifying.verifyAccessToken, getUser);

router.patch("/", verifying.verifyAccessToken, updateProfile);

router.patch(
  "/picture",
  verifying.verifyAccessToken,
  multerMiddleware,
  updateProfilePicture
);

router.patch(
  "/change-password",
  verifying.verifyAccessToken,
  validation.validateChangePassword,
  changePassword
);

module.exports = router;
