const { check, body, validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      console.log("val", result);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

module.exports = {
  validateRegister: validate([
    body("role").isIn(["USER", "TENANT"]).withMessage("Invalid role"),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("email")
      .isEmail()
      .withMessage("Please enter with email format")
      .notEmpty()
      .withMessage("Email is required"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters")
      .isStrongPassword({
        minSymbols: 0,
      })
      .withMessage(
        "Password must contain minimum 1 uppercase, 1 lowercase and 1 numbers"
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Confirm password does not match with password");
        }
        return true;
      }),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required"),
    body("file")
      .if(body("role").equals("TENANT"))
      .custom((value, { req }) => {
        if (!req.file) throw new Error("ID card is required for TENANT role");
        return true;
      }),
  ]),

  validateLogin: validate([
    body("role").isIn(["USER", "TENANT"]).withMessage("Invalid user role"),
    body("email").notEmpty().withMessage("Please fill in email").isEmail(),
    body("password").notEmpty().withMessage("Please fill in password"),
  ]),

  validateVerify: validate([
    body("otp")
      .notEmpty()
      .withMessage("Please input OTP")
      .isLength(4)
      .withMessage("OTP not complete"),
  ]),

  validateChangePassword: validate([
    body("oldPass")
      .notEmpty()
      .withMessage("Please fill in your current password."),
    body("newPass")
      .notEmpty()
      .withMessage("Please fill in your new password.")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters.")
      .isStrongPassword({
        minSymbols: 0,
      })
      .withMessage(
        "Password must contain minimum 1 uppercase, 1 lowercase and 1 number."
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirmPass) {
          throw new Error("Confirm password does not match with new password.");
        }
        return true;
      }),
    body("confirmPass")
      .notEmpty()
      .withMessage("Please fill in password confirmation."),
  ]),

  validateForgotPassword: validate([
    body("email")
      .isEmail()
      .withMessage("Please enter with email format")
      .notEmpty()
      .withMessage("Email is required"),
  ]),

  validateResetPassword: validate([
    body("token").notEmpty().withMessage("Token required"),
    body("password")
      .notEmpty()
      .withMessage("Please fill in your new password.")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters.")
      .isStrongPassword({
        minSymbols: 0,
      })
      .withMessage(
        "Password must contain minimum 1 uppercase, 1 lowercase and 1 number."
      ),
  ]),
};
