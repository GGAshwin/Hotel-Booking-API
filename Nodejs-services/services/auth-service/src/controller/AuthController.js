require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const { connectAndSync, User } = require("../../connect");
const router = express.Router();
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../constant");
const verifyToken = require("../middlewares/auth");

connectAndSync();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    let { role } = req.body;
    console.log(req.body);

    // Check for missing fields
    if (!first_name || !last_name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    if (role !== "TRAVELER" && role !== "HOTEL_MANAGER") {
      role = "TRAVELER";
    }

    // make the role default to traveler
    if (!role) {
      role = "TRAVELER";
    }

    // Create a new user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password
      role,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        user_id: newUser.user_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: existingUser.user_id, role: existingUser.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, user_id: existingUser.user_id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify", verifyToken, async (req, res) => {
  res.status(200).json({
    isValid: true,
    userId: req.user.user_id,
    role: req.user.role,
  });
});

module.exports = router;
