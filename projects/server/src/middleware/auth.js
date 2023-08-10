const jwt = require("jsonwebtoken");
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
            message: "Access token verification failed",
          });
          return;
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).send({
          message: "invalid access token",
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
};
