const express = require("express");
const router = express.Router();
const travelerController = require("../controller/TravelerController");

router.use("/traveler", travelerController);

module.exports = router;
