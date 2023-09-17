const router = require("express").Router();
const { getAllReport } = require("../controller/report");
const verifying = require("../middleware/auth");

router.get(
  "/",
  verifying.verifyAccessToken,
  verifying.verifyTenant,
  getAllReport
);

module.exports = router;
