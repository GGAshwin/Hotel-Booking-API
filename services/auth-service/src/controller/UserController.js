const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../../../connect");
const verifyToken = require("../middlewares/auth");
const { JWT_SECRET } = require("../constant");

const router = express.Router();

// Update user profile
router.put("/:user_id", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, password } = req.body;

    if (req.user.user_id !== user_id && req.user.role !== 'HOTEL_MANAGER') {
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
    // NEED TO DISCUSS ON THIS
    // if (req.user.user_id !== user_id && req.user.role !== 'HOTEL_MANAGER') {
    //   return res.status(403).json({ error: "Unauthorized access" });
    // }

    const user = await User.findByPk(user_id, {
      attributes: ['user_id', 'first_name', 'last_name', 'email', 'role']
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
    if (req.user.user_id !== user_id && req.user.role !== 'HOTEL_MANAGER') {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Change password
router.put("/:user_id/change-password", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (req.user.user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Forgot password (trigger email)
router.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a reset token (e.g., JWT or custom token)
    const resetToken = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '15m' });

    // Here, you should send the resetToken to the user's email
    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset password
router.post("/auth/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.user_id);

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
