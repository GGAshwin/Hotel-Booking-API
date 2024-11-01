const express = require("express");
const app = express();
const AuthController = require('./src/controller/AuthController')
require('dotenv').config();

app.use(express.json());

app.use("/auth", AuthController);

app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

app.listen(3000, () => {
  console.log("listening to port 3000 (AUTH SERVICE)");
});
