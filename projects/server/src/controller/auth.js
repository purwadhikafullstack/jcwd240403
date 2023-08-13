const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");

const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const { Console } = require("console");

const secretKey = process.env.JWT_SECRET_KEY;

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
      const verifyToken = crypto.randomBytes(16).toString("hex");

      // generate otp
      const otp = Math.random(new Date().getTime() * 666666)
        .toString()
        .substring(2, 6);
      const time = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log("time", time);

      const newUser = await db.User.create({
        role: role,
        verify_token: verifyToken,
        otp: otp,
        otp_created_time: time,
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
        text: `Hello ${name},
  
        Welcome to Innsight!
  
        Your verification OTP is: ${otp}
        This OTP will be expired in 24 hour. Do not share this OTP to anyone and keep it for yourself :).
        Please click the following link to complete your registration:
  
        http://localhost:3000/verify/${verifyToken}
  
  
        Thanks,
        Innsight Team`,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log("TRANSPORTER_ERR", err, mailOptions);
        } else {
          console.log("TRANSPORTER_SUCCESS", info);
        }
      });

      res.status(201).send({
        message: "Registration success",
        data: {
          role: newUser.role,
          email: newUser.email,
          name: newProfile.full_name,
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
        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
          expiresIn: "24hr",
        });
        res.status(200).send({
          message: "login success",
          role: user.role,
          email: user.email,
          accessToken: token,
        });
        return;
      } else {
        res.status(400).send({
          message: "login failed, incorect username or password",
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

      const time = new Date(user.otp_created_time);
      const now = new Date();

      time.setHours(time.getHours() + 24);
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

      res.status(200).send({
        message: "Verification process is success",
      });
    } catch (error) {
      console.log("verify", error);
      res.status(500).send({ message: "Something wrong on server" });
    }
  },

  async resendOTP(req, res) {
    try {
      const email = req.params.email;
      // const today = new Date().toISOString().slice(0, 10);
      // console.log("today", today);

      // alternative
      const currentDate = moment(new Date()).utcOffset(7).toDate();
      const startOfDay = moment(currentDate).startOf("date").toDate();
      const endOfDay = moment(currentDate).endOf("date").toDate();

      const otpRequest = await db.User.findOne({
        where: {
          email: email,
          otp_created_time: {
            [db.Sequelize.Op.between]: [startOfDay, endOfDay],
          },
          // otp_created_time: today,
        },
      });
      console.log("otp req", otpRequest, currentDate);
      console.log("jam db", otpRequest.otp_created_time);

      if (!otpRequest.email) {
        return res.status(400).send({
          message: "Account not found",
        });
      }

      if (otpRequest.is_verified) {
        return res.status(400).send({
          message: "Account already verified",
        });
      }

      if (otpRequest) {
        if (otpRequest.otp_counter >= 5) {
          return res
            .status(400)
            .send(
              "You have reached the maximum OTP resend requests for today."
            );
        } else {
          otpRequest.otp_counter += 1;
          const newOtp = Math.random(new Date().getTime() * 666666)
            .toString()
            .substring(2, 6);
          otpRequest.otp = newOtp;
          await otpRequest.save();
          res.status(200).send("OTP sent.");
        }
      } else {
        await otpRequest.update({ otp_counter: 0 });
        res.status(200).send("You have maximun OTP resend request 5 per day.");
      }
    } catch (error) {
      console.log("resendotp", error);
      res.status(500).send({ message: "Something wrong on server" }), error;
    }
  },
};
