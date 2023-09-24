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
  const transaction = await db.sequelize.transaction();
  try {
    const { oldPass, newPass, confirmPass } = req.body;
    const id = req.user.id;
    const user = await db.User.findOne({
      where: { id: id },
    });

    const isValid = await bcrypt.compare(oldPass, user.password);

    if (user && isValid) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPass, salt);

      const changePassword = await db.User.update(
        { password: hashPassword },
        { where: { id: id }, transaction }
      );

      const updated = await db.User.findOne({
        where: { id: id },
      });

      if (changePassword) {
        await transaction.commit();
        return res.status(200).send({
          message: "Change password success.",
          data: updated,
        });
      } else {
        return res.status(400).send({
          message: "Change password failed.",
        });
      }
    } else {
      return res.status(400).send({
        message: "Please input your current password correctly.",
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.log("change pass", error);
    res.status(500).send({
      message: "Something wrong on server",
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
