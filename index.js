const express = require("express");
const app = express();
const indexRoute = require("./src/routes/indexRoutes");

app.use(express.json());

app.use("/api", indexRoute);

app.get("/health", (req, res) => {
  res.json({ health: "ok" });
});

app.listen(3000, () => {
  console.log("listening to port 3000");
});
