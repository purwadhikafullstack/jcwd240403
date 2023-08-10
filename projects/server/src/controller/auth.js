const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");

const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
  async register(req, res) {
    // try {
    //   const { email } = req.body;
    //   console.log(req.body);
    //   console.log(email);

    //   res.status(200).send({
    //     message: "Data extracted successfully",
    //     email: email,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send({
    //     message: "Something went wrong",
    //     error: error,
    //   });
    // }
    try {
      const { role, name, email, phoneNumber, password, confirmPassword } =
        req.body;
      console.log(req.body);
      console.log(email);

      const imageURL = setFromFileNameToDBValue(req.file.filename);

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

      const verifyToken = crypto.randomBytes(16).toString("hex");
      // const time = new Date();

      const newUser = await db.User.create({
        role: role,
        verify_token: verifyToken,
        email: email,
        password: hashPassword,
      });

      const newProfile = await db.Profile.create({
        user_id: newUser.id,
        full_name: name,
        phone_number: phoneNumber,
        document_identity: imageURL,
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
};
