const cron = require("node-cron");
const db = require("../models");
const { Op } = require("sequelize");

const checkInReminder = async () => {
  try {
    cron.schedule("0 0 * * *", async function () {
      try {
        const now = new Date();
        const tmr = new Date(now);
        tmr.setDate(now.getDate() + 1);
        const getBooking = await db.Booking.findAll({
          where: {
            check_in_date: tmr,
          },
          include: [
            {
              model: db.User,
              include: [
                {
                  model: db.Profile,
                },
              ],
            },
            {
              model: db.Room,
              include: [
                {
                  model: db.Property,
                  include: [
                    {
                      model: db.Property_type,
                    },
                    {
                      model: db.Location,
                    },
                  ],
                },
              ],
            },
          ],
        });
        console.log("checking Booking Data");
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
