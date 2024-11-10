const express = require("express");
const { connectAndSync, Feedback, User, sequelize } = require("../../../../connect");
const { QueryTypes } = require("sequelize");
const router = express.Router();

connectAndSync();

// Add feedback for a hotel
router.post("/", async (req, res) => {
  const { hotel_id, traveler_id, comments, rating } = req.body;

  // Log the incoming request data
  console.log("Received feedback data:", { hotel_id, traveler_id, comments, rating });

  // Check if traveler exists
  const traveler = await User.findByPk(traveler_id);
  if (!traveler || traveler.role !== "TRAVELER") {
    console.log(`Traveler with ID ${traveler_id} not found or invalid role.`);
    return res.status(400).json({ error: "Invalid traveler ID" });
  }

  // Check if hotel exists
  const existingHotel = await sequelize.query(
    "SELECT * FROM hotel WHERE id = ?",
    {
      replacements: [hotel_id],
      type: QueryTypes.SELECT,
    }
  );

  if (!existingHotel.length) {
    console.log(`Hotel with ID ${hotel_id} not found.`);
    return res.status(400).json({ error: "Hotel not found" });
  }

  try {
    const feedback = await Feedback.create({
      hotel_id,
      traveler_id,
      comments,
      rating,
    });

    // Log the created feedback data
    console.log("Feedback created:", feedback);

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ error: "Failed to add feedback", details: error });
  }
});

// Get all feedback for a specific hotel
router.get("/:hotel_id", async (req, res) => {
  const hotel_id = req.params.hotel_id;

  // Check if hotel exists
  const existingHotel = await sequelize.query(
    "SELECT * FROM hotel WHERE id = ?",
    {
      replacements: [hotel_id],
      type: QueryTypes.SELECT,
    }
  );

  if (!existingHotel.length) {
    console.log(`Hotel with ID ${hotel_id} not found.`);
    return res.status(404).json({ error: "Hotel not found" });
  }

  try {
    const feedbacks = await Feedback.findAll({
      where: { hotel_id },
      attributes: ["id", "traveler_id", "comments", "rating", "created_at"],
      order: [["created_at", "DESC"]],
    });

    // Log the retrieved feedbacks
    console.log("Retrieved feedbacks:", feedbacks);

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error retrieving feedbacks:", error);
    res.status(500).json({ error: "Failed to retrieve feedback", details: error });
  }
});

// Get feedback by ID
router.get("/feedback/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      console.log(`Feedback with ID ${id} not found.`);
      return res.status(404).json({ error: "Feedback not found" });
    }

    // Log the retrieved feedback
    console.log("Retrieved feedback:", feedback);

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    res.status(500).json({ error: "Failed to retrieve feedback", details: error });
  }
});

// Delete feedback by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Feedback.destroy({ where: { id } });
    if (result) {
      console.log(`Feedback with ID ${id} deleted successfully.`);
      res.status(200).json({ message: "Feedback deleted successfully" });
    } else {
      console.log(`Feedback with ID ${id} not found.`);
      res.status(404).json({ error: "Feedback not found" });
    }
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ error: "Failed to delete feedback", details: error });
  }
});

module.exports = router;
