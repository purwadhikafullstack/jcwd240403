const cron = require("node-cron");
const db = require("../models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
require("dotenv").config();
const moment = require("moment-timezone");

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
        // console.log(getBooking);
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        let mailOptions = {};
        getBooking.forEach((element) => {
          const email = element?.User?.email;

          if (email) {
            mailOptions = {
              from: process.env.SMTP_USER,
              to: email,
              subject: "Booking Reminder",
              text: `Hello,
  
        Welcome to Innsight!
        
        Don't Forget to Check in at ${moment(
          element.check_in_date,
          "YYYY-MM-DD"
        ).format("DD/MM/YYYY")} in ${
                element.Room.Property.name
              }, Check In Detail Is Below Here :

        Name : ${element.User.Profile.full_name}
        Booking Code : ${element.booking_code}
        Check in Date : ${moment(element.check_in_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        )}
        Check Out Date : ${moment(element.check_out_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        )}
        Property Name : ${element.Room.Property.name}
        Room : ${element.Room.name}
      
        
        Maximum Check In Time is 12:00 AM

        Rules & Regulation :
        
        1) Check-in time is usually at 13:00 or 14:00, while the check-out time is no later than 12:00. If guests exceed the check-out time, the hotel typically imposes a fine or additional charges.

        2) Guests must be willing to provide their ID card or personal identification when checking in and may be requested to present it again during check-out.

        3) The maximum guest capacity is two persons per room, except for triple, family, or dormitory rooms, which can accommodate more people. If the guest capacity exceeds the specified limit, additional charges may apply, or renting an extra bed may be required.

        4) There is usually a maximum cancellation deadline for room reservations. If it exceeds the set limit, the reservation deposit may not be refunded, may be refunded only partially, or may even incur additional charges.

        5) Guests are prohibited from sharing a room with individuals of the opposite sex who are not their spouse. Guests are also prohibited from making disruptive noise, engaging in illegal activities, and bringing alcoholic beverages and narcotics.

        6) Guests are not allowed to take hotel room belongings or property with them. However, some hotels may permit it under specific conditions, usually requiring reimbursement with a designated fee.
  
        Thanks,
        Innsight Team`,
            };
            transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                console.log("TRANSPORTER_ERR", err, mailOptions);
              } else {
                console.log("Email sent", info);
              }
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = checkInReminder;
