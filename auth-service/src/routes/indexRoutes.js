const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");

router.use("/register", AuthController);

module.exports = router;
