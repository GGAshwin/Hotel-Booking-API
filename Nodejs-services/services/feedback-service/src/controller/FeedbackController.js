const express = require("express");
const axios = require("axios"); // For calling external APIs
const { connectAndSync, Feedback, sequelize } = require("../../connect");
const { QueryTypes } = require("sequelize");
const router = express.Router();

connectAndSync();

// const AUTH_SERVICE_URL = "http://localhost:3000/auth";
const AUTH_SERVICE_URL =
  "https://auth-service.cfapps.us10-001.hana.ondemand.com/auth";
const HOTL_SERVICE_URL =
  "https://hotel-service-1.cfapps.eu12.hana.ondemand.com/api";
// const HOTL_SERVICE_URL = "http://localhost:8080";

// Middleware to verify user role
async function verifyUserRole(token, expectedRole) {
  try {
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

    if (role !== expectedRole) {
      throw new Error(`Expected role ${expectedRole}, but got ${role}`);
    }
    return true;
  } catch (error) {
    console.error("Error verifying user role:", error.message || error);
    return false;
  }
}

// Helper function to generate a token for a service account
async function generateUserToken() {
  try {
    const traveler_token = await axios.post(`${AUTH_SERVICE_URL}/login`, {
      email: "service_account.traveler@example.com",
      password: "service_account_secret",
    });

    return traveler_token.data.token;
  } catch (error) {
    console.error("Error generating user token:", error.message || error);
    return null;
  }
}

// Helper function to check if a hotel exists
async function checkIfHotelExists(hotel_id, token) {
  try {
    const response = await axios.get(`${HOTL_SERVICE_URL}/hotels/${hotel_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    if (response.status === 200 && response.data) {
      return response.data; // Return the hotel data if it exists
    }
  } catch (error) {
    console.log(error);

    console.error("Error checking hotel existence:", error.message || error);
  }
  return null; // Return null if the hotel doesn't exist or there's an error
}

// Add feedback for a hotel (only for users with role: TRAVELER)
router.post("/", async (req, res) => {
  const { hotel_id, traveler_id, comments, rating } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  const isTraveler = await verifyUserRole(token, "TRAVELER");
  console.log(isTraveler);

  if (!isTraveler) {
    return res.status(403).json({
      error: "Only users with the role of TRAVELER can give feedback",
    });
  }

  let hotel = await checkIfHotelExists(hotel_id, token);
  if (!hotel) {
    return res.status(404).json({ error: "Hotel not found" });
  }

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

  try {
    let token_traveler = await generateUserToken();
    const hotel = await checkIfHotelExists(hotel_id, token_traveler);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const orderColumn = sort === "rating" ? "rating" : "created_at";
    const orderDirection = order.toLowerCase() === "asc" ? "ASC" : "DESC";

    const feedbacks = await Feedback.findAll({
      where: { hotel_id },
      attributes: ["id", "traveler_id", "comments", "rating", "created_at"],
      order: [[orderColumn, orderDirection]],
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

// Get feedback for all hotels
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      attributes: ["id", "hotel_id", "traveler_id", "comments", "rating", "created_at"],
      order: [["created_at", "DESC"]],
    });

    if (feedbacks.length === 0) {
      return res.status(200).json({ message: "No feedback available for any hotel" });
    }

    res.status(200).json(feedbacks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve feedback for all hotels", details: error });
  }
});

// Delete feedback by ID (Only HOTEL_MANAGER can delete any feedback, or TRAVELER can delete their own feedback)
router.delete("/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token
  const feedbackId = req.params.id; // Feedback ID from the URL parameter

  try {
    // Verify the user's role and get user_id from the verification response
    const verifyResponse = await axios.post(
      `${AUTH_SERVICE_URL}/verify`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const { role, userId: userId } = verifyResponse.data;
    console.log(verifyResponse.data);

    // Fetch the feedback record using the feedback ID
    const feedback = await Feedback.findOne({ where: { id: feedbackId } });

    // If feedback does not exist, return 404
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    // Authorization logic:
    // - HOTEL_MANAGER can delete any feedback
    // - TRAVELER can delete their own feedback only
    if (
      role === "HOTEL_MANAGER" ||
      (role === "TRAVELER" && feedback.traveler_id === userId)
    ) {
      // Delete the feedback
      await Feedback.destroy({ where: { id: feedbackId } });
      return res.status(200).json({ message: "Feedback deleted successfully" });
    } else {
      // Unauthorized access
      return res.status(403).json({
        error: "You are not authorized to delete this feedback",
      });
    }
  } catch (error) {
    // Handle errors gracefully
    console.error("Error during feedback deletion:", error.message || error);
    return res.status(500).json({
      error: "Failed to delete feedback",
      details: error.message || error,
    });
  }
});

module.exports = router;
