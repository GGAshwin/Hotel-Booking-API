const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../connect");
const verifyToken = require("../middlewares/auth");
const { JWT_SECRET } = require("../constant");
const { v4: isUUID } = require("uuid");

const router = express.Router();

// Update user profile
router.put("/:user_id", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, password } = req.body;

    if (req.user.user_id !== user_id && req.user.role !== "HOTEL_MANAGER") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user profile
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Check if user_id is a valid UUID
    if (!isUUID(user_id)) {
      return res.status(400).json({ error: "User ID must be a valid UUID" });
    }

    const user = await User.findByPk(user_id, {
      attributes: ["user_id", "first_name", "last_name", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete user account
router.delete("/:user_id", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;

    // Ensure the logged-in user is the same as the user being deleted
    if (req.user.user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Find the user to delete
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user account
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
