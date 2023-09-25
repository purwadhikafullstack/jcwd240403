const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = {
  async emailRegister(email, name, otp, token) {
    try {
      // Email sending
      let transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Welcome!",
        text: `Hello ${name},
  
        Welcome to Innsight!
  
        Your verification OTP is: ${otp}
        This OTP will be expired in 24 hour. Do not share this OTP to anyone and keep it for yourself :).
        Please click the following link to complete your registration:
  
        http://localhost:3000/verify/${token}
  
  
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
    } catch (error) {
      console.log("EMAIL REGISTER", error);
      error;
    }
  },

  async emailResentOtp(email, otp, token) {
    try {
      // Email sending
      let transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Resend OTP",
        text: `Resend OTP Request

    Your verification OTP is: ${otp}
    This OTP will be expired in 24 hour. Do not share this OTP to anyone and keep it for yourself :).
    You can request to resend OTP maximum 5 times per day.
    Please click the following link to complete your registration:

    http://localhost:3000/verify/${token}


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
    } catch (error) {
      console.log("email resent otp", error);
      error;
    }
  },

  async emailForgotPassword(email, name, token) {
    try {
      // Email sending
      let transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Reset password request.",
        text: `Hello ${name},

        Please click the following link to reset your password:

        http://localhost:3000/reset-password/${token}

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
    } catch (error) {
      console.log("email forgot password", error);
      error;
    }
  },
};
