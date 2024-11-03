const express = require("express");
const app = express();
const PaymentController = require('./src/controller/PaymentController')
require('dotenv').config();

app.use(express.json());

app.use("/api/payments", PaymentController);

app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

app.listen(3001, () => {
  console.log("listening to port 3001 (PAYMENT SERVICE)");
});
