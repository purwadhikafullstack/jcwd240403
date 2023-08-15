const multerMiddleware = require("../middleware/multer");
const router = require("express").Router();
const verifying = require("../middleware/auth");
const validation = require("../middleware/validation");
const {
  getUser,
  updateProfile,
  updateProfilePicture,
  changePassword,
} = require("../controller/profile");

router.get("/profile", verifying.verifyAccessToken, getUser);

router.patch("profile", verifying.verifyAccessToken, updateProfile);

router.patch(
  "/profile/picture",
  verifying.verifyAccessToken,
  multerMiddleware,
  updateProfilePicture
);

router.patch("/profile/password", verifying.verifyAccessToken, changePassword);
