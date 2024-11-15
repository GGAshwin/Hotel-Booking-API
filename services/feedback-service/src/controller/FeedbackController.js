const express = require("express");
const axios = require("axios"); // For calling external APIs
const { connectAndSync, Feedback, sequelize } = require("../../connect");
const { QueryTypes } = require("sequelize");
const router = express.Router();

connectAndSync();

const AUTH_SERVICE_URL = "http://localhost:3000/auth";

// Middleware to verify user role
async function verifyUserRole(token, expectedRole) {
  try {
    // Ensure the token is being passed properly
    if (!token) {
      throw new Error("Token is missing");
    }

    const verifyResponse = await axios.post(
      `${AUTH_SERVICE_URL}/verify`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const { role } = verifyResponse.data;

    // Ensure role matches the expected role
    if (role !== expectedRole) {
      throw new Error(`Expected role ${expectedRole}, but got ${role}`);
    }
    return true;
  } catch (error) {
    console.error("Error verifying user role:", error.message || error);
    return false;
  }
}

// Add feedback for a hotel (only for users with role: TRAVELER)
router.post("/", async (req, res) => {
  const { hotel_id, traveler_id, comments, rating } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token

  // Verify the user role as TRAVELER
  const isTraveler = await verifyUserRole(token, "TRAVELER");

  if (!isTraveler) {
    return res.status(403).json({
      error: "Only users with the role of TRAVELER can give feedback",
    });
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
    return res.status(400).json({ error: "Hotel not found" });
  }

  // Check if feedback already exists for the traveler and hotel
  const existingFeedback = await Feedback.findOne({
    where: { hotel_id, traveler_id },
  });

  if (existingFeedback) {
    return res.status(400).json({
      error: "Feedback already exists for this traveler and hotel",
    });
  }

  try {
    const feedback = await Feedback.create({
      hotel_id,
      traveler_id,
      comments,
      rating,
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Failed to add feedback", details: error });
  }
});

// Get all feedback for a specific hotel with sorting options
router.get("/:hotel_id", async (req, res) => {
  const hotel_id = req.params.hotel_id;
  const { sort = "date", order = "desc" } = req.query;

  const existingHotel = await sequelize.query(
    "SELECT * FROM hotel WHERE id = ?",
    {
      replacements: [hotel_id],
      type: QueryTypes.SELECT,
    }
  );

  // Check if hotel exists
  if (!existingHotel.length) {
    return res.status(404).json({ error: "Hotel not found" });
  }

  // Determine the column to sort by and the order direction
  const orderColumn = sort === "rating" ? "rating" : "created_at";
  const orderDirection = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  try {
    const feedbacks = await Feedback.findAll({
      where: { hotel_id },
      attributes: ["id", "traveler_id", "comments", "rating", "created_at"],
      order: [[orderColumn, orderDirection]], // Order by date (created_at) or rating as specified
    });

    if (feedbacks.length === 0) {
      return res
        .status(200)
        .json({ message: "No feedback available for this hotel" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve feedback", details: error });
  }
});

// Delete feedback by ID (Only HOTEL_MANAGER can delete)
router.delete("/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Verify the user role as HOTEL_MANAGER
  const isHotelManager = await verifyUserRole(token, "HOTEL_MANAGER");
  if (!isHotelManager) {
    return res.status(403).json({
      error: "Only users with the role of HOTEL_MANAGER can delete feedback",
    });
  }

  const id = req.params.id;

  try {
    const result = await Feedback.destroy({ where: { id } });
    if (result) {
      res.status(200).json({ message: "Feedback deleted successfully" });
    } else {
      res.status(404).json({ error: "Feedback not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete feedback", details: error });
  }
});

module.exports = router;
