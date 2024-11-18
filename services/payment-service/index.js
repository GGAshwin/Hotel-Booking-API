const express = require("express");
const app = express();
const PaymentController = require('./src/controller/PaymentController')
const port = process.env.PORT || 3001;
const environment = process.env.NODE_ENV || 'development';
require('dotenv').config();

app.use(express.json());

app.use("/api/payments", PaymentController);

app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

app.listen(8080, () => {
  console.log(`App runnig in ${environment} listening to port ${port} (PAYMENT SERVICE)`);
});
