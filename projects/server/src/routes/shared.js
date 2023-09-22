const router = require("express").Router();
const { shared: sharedController } = require("../controller");

router.get("/top", sharedController.getTopProperty);
router.get("/location/all", sharedController.getAllLocation);
router.get("/property-type/all", sharedController.getAllPropType);

module.exports = router;
