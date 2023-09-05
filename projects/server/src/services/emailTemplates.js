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
    }
  },

  async emailResentOtp() {
    try {
    } catch (error) {}
  },

  async emailForgotPassword() {
    try {
    } catch (error) {}
  },
};
