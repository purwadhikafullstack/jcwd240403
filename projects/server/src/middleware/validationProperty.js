const { check, body, validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      console.log("val", result);
      console.log("req.body", req.body);
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
  validateAddCategoryArea: validate([
    body("categoryArea")
      .notEmpty()
      .withMessage("Category area field can not be empty."),
  ]),

  validateEditCategoryArea: validate([
    body("newName")
      .notEmpty()
      .withMessage("Category area name field can not be empty."),
  ]),

  validateAddProperty: validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("locationId").notEmpty().withMessage("Location id is required"),
    body("propTypeId").notEmpty().withMessage("Property type id is required"),
    body("catAreaId").notEmpty().withMessage("Category area id is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ]),

  validateAddPropertyPhotos: validate([
    body("propId").notEmpty().withMessage("Property id is required"),
  ]),

  validateAddRoom: validate([
    body("propId").notEmpty().withMessage("Property id is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("file").custom((value, { req }) => {
      if (!req.file) throw new Error("Room picture is required");
      return true;
    }),
  ]),
};
