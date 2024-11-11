const express = require("express");
const app = express();
const FeedbackController = require('./src/controller/FeedbackController'); // Adjust path if needed
require('dotenv').config();

app.use(express.json());

// Routes
app.use("/api/feedback", FeedbackController);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

// Start the feedback service server
app.listen(3002, () => {
  console.log("listening to port 3002 (FEEDBACK SERVICE)");
});
