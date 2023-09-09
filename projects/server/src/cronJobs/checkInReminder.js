const cron = require("node-cron");
const db = require("../models");
const { Op } = require("sequelize");

const checkInReminder = async () => {
  try {
    cron.schedule("*/30 * * * *", async function () {
      try {
        const now = new Date();
        const tmr = new Date(now);
        tmr.setDate(now.getDate() + 1);
        const getBooking = await db.Booking.findAll({
          where: {
            check_in_date: {
              [Op.between]: [now, tmr],
            },
          },
          raw: true,
        });
        console.log(getBooking);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = checkInReminder;
