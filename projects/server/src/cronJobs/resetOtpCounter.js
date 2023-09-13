const cron = require("node-cron");
const db = require("../models");
const moment = require("moment-timezone");

const resetOtpCounterJob = () => {
  cron.schedule("0 * * * *", async function () {
    try {
      const time = moment().format("HH:mm");
      if (time === "00:00") {
        await db.User.update({ otp_counter: 0 }, { where: {} });
        console.log("OTP counters reset successfully.");
      }
    } catch (err) {
      console.error("Error resetting OTP counters:", err);
    }
  });
};

module.exports = resetOtpCounterJob;
