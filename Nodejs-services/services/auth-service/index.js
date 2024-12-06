const express = require("express");
const app = express();
const AuthController = require("./src/controller/AuthController");
const UserController = require("./src/controller/UserController");
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || "development";
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/auth", AuthController);
app.use("/api/users", UserController);

app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

app.get("/", (req, res) => {
  res.json({ status: "Auth and User service running" });
});

app.listen(port, () => {
  console.log(
    `App runnig in ${environment} listening to port ${port} (AUTH SERVICE & USER SERVICE)`
  );
});
