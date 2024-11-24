const express = require("express");
const app = express();
const AuthController = require("./src/controller/AuthController");
const UserController = require("./src/controller/UserController");
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
require("dotenv").config();

app.use(express.json());

app.use("/auth", AuthController);
app.use("/api/users", UserController);

app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

app.listen(port, () => {
  console.log(`App runnig in ${environment} listening to port ${port} (AUTH SERVICE & USER SERVICE)`);
});
