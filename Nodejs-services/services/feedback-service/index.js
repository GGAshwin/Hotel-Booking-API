const express = require("express");
const app = express();
const FeedbackController = require("./src/controller/FeedbackController"); // Adjust path if needed
const port = process.env.PORT || 3002;
const environment = process.env.NODE_ENV || "development";
require("dotenv").config();

app.use(express.json());

// Routes
app.use("/api/feedback", FeedbackController);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

// Start the feedback service server
app.listen(port, () => {
  console.log(
    `listening to port ${port} (FEEDBACK SERVICE) running in ${environment} environment`
  );
});
