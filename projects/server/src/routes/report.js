const router = require("express").Router();
const { getAllReport, getAllReportByDate } = require("../controller/report");
const verifying = require("../middleware/auth");

router.get(
  "/",
  verifying.verifyAccessToken,
  verifying.verifyTenant,
  getAllReport
);

router.get(
  "/:date",
  verifying.verifyAccessToken,
  verifying.verifyTenant,
  getAllReportByDate
);

module.exports = router;
