const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
require("dotenv").config();

const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");

const secretKey = process.env.JWT_SECRET_KEY;

async function updateAndResendOTP(user) {
  user.otp_counter = (user.otp_counter || 0) + 1;
  user.otp = generateOTP();
  user.otp_created_time = moment().format("YYYY-MM-DD HH:mm:ss"); // Updating to current time
  await user.save();
  // Email sending
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: "Resend OTP",
    text: `Resend OTP Request

    Your verification OTP is: ${user.otp}
    This OTP will be expired in 24 hour. Do not share this OTP to anyone and keep it for yourself :).
    You can request to resend OTP maximum 5 times per day.
    Please click the following link to complete your registration:

    http://localhost:3000/verify/${user.verify_token}


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

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports = {
  async register(req, res) {
    try {
      const { role, name, email, phoneNumber, password, confirmPassword } =
        req.body;
      console.log(req.body);
      console.log(email);
      let imageURL;

      if (req.file && role === "TENANT") {
        imageURL = setFromFileNameToDBValue(req.file.filename);
        console.log(imageURL);
      }
      console.log("onauth", imageURL, req.file);

      if (password !== confirmPassword)
        return res.status(400).send({
          message: "Password and confirm password have to match",
        });

      const isExist = await db.User.findOne({
        where: { email: email },
      });

      // search if email already registered
      if (isExist) {
        res.status(400).send({
          message: "Email already registered",
        });
        return;
      }

      // generate password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      // generate verify token
      const verifyToken = jwt.sign({ email: email }, secretKey);

      const newUser = await db.User.create({
        role: role,
        verify_token: verifyToken,
        otp: generateOTP(),
        otp_created_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        otp_counter: Number(0),
        email: email,
        password: hashPassword,
      });
      console.log("newus", newUser.otp_created_time);

      const newProfile = await db.Profile.create({
        user_id: newUser.id,
        full_name: name,
        phone_number: phoneNumber,
        document_identity: imageURL,
      });

      // Email sending
      let transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Welcome!",
        text: `Hello ${newProfile.full_name},
  
        Welcome to Innsight!
  
        Your verification OTP is: ${newUser.otp}
        This OTP will be expired in 24 hour. Do not share this OTP to anyone and keep it for yourself :).
        Please click the following link to complete your registration:
  
        http://localhost:3000/verify/${newUser.verify_token}
  
  
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

      res.status(201).send({
        message: "Registration success and email verification already send",
        data: {
          role: newUser.role,
          email: newUser.email,
          name: newProfile.full_name,
          verify_token: newUser.verify_token,
          document_identity: newProfile.document_identity,
        },
      });
    } catch (error) {
      console.log("REGISTER ERROR", error);
      res.status(500).send({
        message: "Something wrong in the server",
        errors: error,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({ where: { email } });

      const isValid = await bcrypt.compare(password, user.password);

      if (user && isValid) {
        const token = jwt.sign(
          { id: user.id, role: user.role, email: user.email },
          secretKey,
          {
            expiresIn: "24hr",
          }
        );
        res.status(200).send({
          message: "login success",
          role: user.role,
          email: user.email,
          accessToken: token,
        });
        return;
      } else {
        res.status(400).send({
          message: "Login failed, incorect email or password",
        });
      }
    } catch (error) {
      console.log("err login", error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async verify_email(req, res) {
    try {
      const { otp, email } = req.params;
      const verifying_email = await db.User.update(
        {
          is_verified: true,
        },
        {
          where: {
            otp: otp,
            email: email,
          },
        }
      );
      if (verifying_email) {
        return res.send({
          status: true,
          message: "email verified",
        });
      } else {
        return res.send({
          status: false,
          message: "otp/email not found",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something wrong on server",
        error,
      });
    }
  },

  async verify(req, res) {
    try {
      const verifyToken = req.params.token;
      const { otp } = req.body;

      const user = await db.User.findOne({
        where: { verify_token: verifyToken, otp: otp },
      });

      if (!user) {
        return res.status(400).send({
          message: "Verification invallid or acount already verified",
        });
      }

      const time = moment(user.otp_created_time).add(24, "hours");
      const now = moment();

      if (now > time) {
        return res.status(400).send({
          message: "OTP expired, please request to resend OTP",
        });
      }

      user.is_verified = true;
      user.verify_token = null;
      user.otp = null;
      user.otp_created_time = null;
      user.otp_counter = null;
      await user.save();

      const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
        expiresIn: "24hr",
      });
      res.status(200).send({
        message: "Verification process is success",
        accessToken: token,
        role: user.role,
      });
    } catch (error) {
      console.log("verify", error);
      res.status(500).send({ message: "Something wrong on server" });
    }
  },

  async resendOTP(req, res) {
    try {
      const { email } = req.body;

      const user = await db.User.findOne({
        where: { email: email },
      });

      if (!user || !user.otp_created_time) {
        return res.status(400).send({
          message: "Account not found or OTP not previously generated",
        });
      }

      if (user.is_verified) {
        return res.status(400).send({
          message: "Account already verified",
        });
      }

      const otpTime = moment(user.otp_created_time, "YYYY-MM-DD HH:mm:ss");
      const currentDay = moment().format("YYYY-MM-DD");
      if (
        otpTime.format("YYYY-MM-DD") === currentDay &&
        user.otp_counter >= 5
      ) {
        return res.status(400).send({
          message:
            "You have reached the maximum OTP resend requests for today.",
        });
      }

      await updateAndResendOTP(user);

      res
        .status(200)
        .send({ message: "Resend OTP success", otp_counter: user.otp_counter });
    } catch (error) {
      console.log("resendotp", error);
      res.status(500).send({ message: "Something wrong on server" }), error;
    }
  },

  async loginWithToken(req, res) {
    try {
      // Fetch the user data from the database
      const user = await db.User.findOne({ where: { id: req.user.id } });
      if (user) {
        const token = jwt.sign({ id: user.id }, secretKey, {
          expiresIn: "1hr",
        });
        res.status(200).json({
          message: "Login success!",
          data: {
            email: user.email,
            token: token,
            role: user.role,
          },
        });
      } else {
        res.status(404).send({
          message: "No user found with this ID.",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  },
};
