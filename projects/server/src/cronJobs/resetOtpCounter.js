const cron = require("node-cron");
const db = require("../models");

const resetOtpCounterJob = () => {
  cron.schedule("0 0 * * *", async function () {
    try {
      await db.User.update({ otp_counter: 0 }, { where: {} });
      console.log("OTP counters reset successfully.");
    } catch (err) {
      console.error("Error resetting OTP counters:", err);
    }
  });
};

module.exports = resetOtpCounterJob;
