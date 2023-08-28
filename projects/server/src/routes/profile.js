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

router.get("/", verifying.verifyAccessToken, getUser);

router.patch("/", verifying.verifyAccessToken, updateProfile);

router.patch(
  "/picture",
  verifying.verifyAccessToken,
  multerMiddleware,
  updateProfilePicture
);

router.patch("/password", verifying.verifyAccessToken, changePassword);

module.exports = router;
