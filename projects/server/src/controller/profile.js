const db = require("../models");
const {
  setFromFileNameToDBValue,
  getFilenameFromDbValue,
  getAbsolutePathPublicFile,
} = require("../utils/file");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
require("dotenv").config();

const getUser = async (req, res) => {
  try {
    const token = req.user;
    const user_id = token.id;
    db.Profile.belongsTo(db.User, { foreignKey: "user_id" });
    const profile = await db.Profile.findOne({
      where: {
        user_id: Number(user_id),
      },
      include: [
        {
          model: db.User,
        },
      ],
    });
    res.send({
      message: "success get profile",
      data: profile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    // const user = req.user;
    const { user } = req;
    const user_id = user.id;
    const { full_name, birth_date, gender, phone_number, email } = req.body;
    const cekEmail = await db.User.findOne({
      where: {
        email: email,
      },
    });
    if (cekEmail && cekEmail.email != user.email) {
      return res.send({
        status: false,
        message: "Email Already Used",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify Email",
      text: `Verify Email Request

      Please Verify Your Email by Clicking Link Below
    

    http://localhost:3000/verify-email/${otp}/${email}



    Thanks,
    Innsight Team`,
    };

    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("TRANSPORTER_ERR", err, mailOptions);
      } else {
        console.log("Email sent", info);
      }
    });

    const updateEmail = await db.User.update(
      {
        email: email,
        is_verified: false,
        otp: otp,
      },
      {
        where: { id: user_id },
      }
    );
    const results = await db.Profile.update(
      {
        full_name: full_name,
        birth_date: birth_date,
        gender: gender,
        phone_number: phone_number,
      },
      {
        where: {
          user_id: Number(user_id),
        },
      }
    );
    if (!results) {
      return res.status(404).send({
        message: "profile is not found",
      });
    }

    return res.send({
      status: true,
      message: "update profile success",
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const token = req.user;
    const user_id = token.id;
    const imageUrl = setFromFileNameToDBValue(req.file?.filename);
    const result = await db.Profile.update(
      { profile_picture: imageUrl },
      {
        where: {
          user_id: Number(user_id),
        },
      }
    );
    if (!result) {
      return res.status(404).send({
        message: "profile picture is not found",
      });
    }

    return res.send({
      status: true,
      message: "update profile picture success",
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { old_password, password, password_confirmation } = req.body;
    const token = req.user;
    const user_id = token.id;
    const result = await db.User.findOne({
      where: {
        id: user_id,
      },
    });
    // cek password lama
    const isValid = await bcrypt.compare(old_password, result.password);
    // result : mencari data user ada apa tidak
    //isValid : mencocokan old_password yang dimasukan sama dengan password lama di DB
    if (result && isValid) {
      // cek password confirmation
      if (password == password_confirmation) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        // memasukan data update
        const updatePassword = await db.User.update(
          { password: hashPassword },
          {
            where: {
              id: user_id,
            },
          }
        );
        if (updatePassword) {
          res.send({
            status: true,
            message: "Update Password Success",
          });
        } else {
          return res.send({
            message: "Update Password Fail Please Try Again",
            status: false,
          });
        }
      } else {
        return res.send({
          message: "Password Confirmation Does Not Match",
          status: false,
        });
      }
    } else {
      return res.send({
        message: "wrong Password",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "fatal error on server",
      error,
    });
  }
};

module.exports = {
  getUser,
  updateProfile,
  updateProfilePicture: updateProfilePicture,
  changePassword,
};
