require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment-timezone");
const db = require("../models");
const template = require("../services/emailTemplates");
const { setFromFileNameToDBValue } = require("../utils/file");

const secretKey = process.env.JWT_SECRET_KEY;

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const generateHashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (err) {
    console.log("err", err);
  }
};

const parseJSONSafely = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
};

const register = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      role,
      name,
      email,
      phoneNumber,
      password,
      isRegisterBySocial,
      photoURL,
    } = req.body;
    let imageURL;

    // Check if a file is uploaded and the role is "TENANT"
    if (req.file && role === "TENANT") {
      imageURL = setFromFileNameToDBValue(req.file.filename);
    }

    // Check if the email is already registered
    const isExist = await db.User.findOne({ where: { email: email } });
    if (isExist) {
      return res.status(400).send({ message: "Email is unavailable." });
    }

    const verifyToken = jwt.sign({ email: email }, secretKey);

    // If isRegisterBySocial is true, ignore the password and phoneNumber
    const hashedPassword = parseJSONSafely(isRegisterBySocial)
      ? null
      : await generateHashedPassword(password);

    const newUser = await db.User.create(
      {
        role: role,
        verify_token: verifyToken,
        otp: generateOTP(),
        otp_created_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        otp_counter: Number(0),
        email: email,
        password: hashedPassword,
        isRegisterBySocial: parseJSONSafely(isRegisterBySocial) || false,
      },
      { transaction }
    );

    const newProfile = await db.Profile.create(
      {
        user_id: newUser.id,
        full_name: name,
        phone_number: parseJSONSafely(isRegisterBySocial) ? null : phoneNumber,
        document_identity: imageURL,
        profile_picture: photoURL || null,
      },
      { transaction }
    );

    // Email sending logic
    template.emailRegister(
      email,
      newProfile.full_name,
      newUser.otp,
      newUser.verify_token
    );

    await transaction.commit();
    res.status(201).send({
      message: "Registration success and email verification already sent.",
      data: {
        role: newUser.role,
        email: newUser.email,
        name: newProfile.full_name,
        verify_token: newUser.verify_token,
        document_identity: newProfile.document_identity,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.log("REGISTER ERROR", error);
    res
      .status(500)
      .send({ message: "Something wrong in the server.", errors: error });
  }
};

const login = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { role, email, password, isLoginBySocial } = req.body;
    const user = await db.User.findOne({
      where: { email },
      attributes: [
        "id",
        "role",
        "email",
        "is_verified",
        "isLoginBySocial",
        "isRegisterBySocial",
      ],
      include: [
        {
          model: db.Profile,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    if (user.role !== role) {
      return res.status(400).send({
        message: "Login failed, please make sure your role.",
      });
    }

    if (isLoginBySocial) {
      if (!user) {
        return res.status(400).send({
          message: "Email is not registered. Please register first.",
        });
      }

      await user.update({ isLoginBySocial: true }, { transaction });

      // Scenario 4: User can login
      const accessToken = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        secretKey,
        {
          expiresIn: "24hr",
        }
      );

      await transaction.commit();
      return res.status(200).send({
        message: "Logged in using Google!",
        accessToken: accessToken,
        data: user,
      });
    } else {
      if (user.isRegisterBySocial) {
        // Scenario 2: Registered via Google, trying to login with email/password
        return res.status(400).send({
          message:
            "You registered via Google, please login via Google account.",
        });
      }
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send({
          message: "Login failed, incorrect email or password.",
        });
      }
    }

    // Scenario 1: User can login conventionally
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      secretKey,
      {
        expiresIn: "24hr",
      }
    );
    await user.update({ isLoginBySocial: false }, { transaction });

    await transaction.commit();
    res.status(200).send({
      message: "Logged in using email!",
      accessToken: accessToken,
      data: user,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("err login", error);
    res.status(500).send({
      message: "Something went wrong on the server.",
      error,
    });
  }
};

const keepLogin = async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.user.id },
      attributes: [
        "id",
        "role",
        "email",
        "is_verified",
        "isLoginBySocial",
        "isRegisterBySocial",
      ],
      include: [
        {
          model: db.Profile,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    if (user) {
      return res.status(200).send({
        message: "Keep login success.",
        data: user,
      });
    } else {
      res.status(404).send({
        message: "No user found.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const verify_email = async (req, res) => {
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
};

const verify = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const verifyToken = req.params.token;
    const { otp } = req.body;

    const user = await db.User.findOne({
      where: { verify_token: verifyToken, otp: otp },
    });

    if (!user) {
      return res.status(400).send({
        message: "Verification invalid or account already verified.",
      });
    }

    const time = moment(user.otp_created_time).add(24, "hours");
    const now = moment();

    if (now > time) {
      return res.status(400).send({
        message: "OTP expired, please request to resend new OTP.",
      });
    }

    const userVerified = await db.User.update(
      {
        is_verified: true,
        verify_token: null,
        otp: null,
        otp_created_time: null,
        otp_counter: null,
      },
      { where: { verify_token: user.verify_token, otp: user.otp }, transaction }
    );

    await transaction.commit();

    const userUpdated = await db.User.findOne({
      where: { id: user.id },
    });

    res.status(200).send({
      message: "Verification process success.",
      data: userUpdated,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("verify", error);
    res.status(500).send({
      message: "Something wrong on server.",
    });
  }
};

const resendOTP = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { email } = req.body;

    const user = await db.User.findOne({
      where: { email: email },
    });

    if (!user || !user.otp_created_time) {
      return res.status(400).send({
        message: "Account not found or OTP not previously generated.",
      });
    }

    if (user.is_verified) {
      return res.status(400).send({
        message: "Account already verified.",
      });
    }

    const otpTime = moment(user.otp_created_time, "YYYY-MM-DD HH:mm:ss");
    const currentDay = moment().format("YYYY-MM-DD");
    if (otpTime.format("YYYY-MM-DD") === currentDay && user.otp_counter >= 5) {
      return res.status(400).send({
        message: "You have reached the maximum OTP resend requests for today.",
      });
    }

    const updateUser = await db.User.update(
      {
        otp_counter: (user.otp_counter || 0) + 1,
        otp: generateOTP(),
        otp_created_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      { where: { email }, transaction }
    );
    await transaction.commit();

    const userUpdated = await db.User.findOne({
      where: { email },
    });

    template.emailResentOtp(email, userUpdated.otp, userUpdated.verify_token);

    res.status(200).send({
      message: "Resend OTP success.",
      otp_counter: userUpdated.otp_counter,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("resendotp", error);
    res.status(500).send({ message: "Something wrong on server." }), error;
  }
};

const forgetPassword = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { email } = req.body;

    const user = await db.User.findOne({
      where: { email: email, isRegisterBySocial: false },
      include: [{ model: db.Profile }],
    });

    if (!user) {
      return res.status(200).send({
        message: "Please check your email to reset your password.",
      });
    }

    const forgotToken = crypto.randomBytes(16).toString("hex");

    const updateUser = await db.User.update(
      {
        forgot_token: forgotToken,
      },
      { where: { email }, transaction }
    );
    await transaction.commit();

    template.emailForgotPassword(email, user.Profile.full_name, forgotToken);

    res.status(200).send({
      message: "Please check your email to reset your password.",
      data: email,
    });
  } catch (error) {
    await transaction.rollback();
    console.log("forgot pass", error);
    res.status(500).send({
      message: "Something wrong on server.",
      error,
    });
  }
};

const resetPassword = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { token, password } = req.body;
    const user = await db.User.findOne({
      where: { forgot_token: token },
    });

    if (!user) {
      return res.status(400).send({
        message: "Token not valid.",
      });
    }

    const updateUser = await db.User.update(
      {
        password: await generateHashedPassword(password),
        forgot_token: null,
      },
      { where: { id: user.id }, transaction }
    );

    await transaction.commit();

    res.status(200).send({
      message: "Success reset password.",
    });
  } catch (error) {
    await transaction.rollback();
    console.log("reset pass", error);
    res.status(500).send({
      message: "Something wrong on server",
      error,
    });
  }
};

module.exports = {
  register,
  login,
  keepLogin,
  verify_email,
  verify,
  resendOTP,
  forgetPassword,
  resetPassword,
};
