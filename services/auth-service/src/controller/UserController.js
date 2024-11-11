const express = require("express");
const { connectAndSync, User } = require("../../../../connect");
const router = express.Router();

connectAndSync();

router.get("/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404).json({ error: "User not Found" });
    return;
  }

  res.status(200).json({
    user,
  });
});

module.exports = router;
