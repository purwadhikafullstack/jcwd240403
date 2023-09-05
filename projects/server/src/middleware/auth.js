const jwt = require("jsonwebtoken");
const db = require("../models");
const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
  async verifyAccessToken(req, res, next) {
    // check token valid or not
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, secretKey);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).send({
          message: "invalid token",
          error,
        });
      }
    }
  },

  async verifyTenant(req, res, next) {
    if (req.user.role === "TENANT") {
      return next();
    }
    res.status(401).send({
      message: "Role is not allowed to access",
    });
  },

  async verifyUser(req, res, next) {
    if (req.user.role === "USER") {
      return next();
    }
    res.status(401).send({
      message: "Role is not allowed to access",
    });
  },

  async verifyAccountUser(req, res, next) {
    const findUser = await db.User.findOne({
      where: { id: req.user.id },
    });

    if (findUser.is_verified === true) {
      return next();
    } else {
      res.status(400).send({
        message: "Please verify your email to make booking.",
      });
    }
  },
};
