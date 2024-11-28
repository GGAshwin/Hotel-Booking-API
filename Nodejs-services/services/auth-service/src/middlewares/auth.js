const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constant");

const verifyToken = (req, res, next) => {
  // will the token be sent in auth headers or req body??
  // confirm with java
  const tokenFromHeader = req.headers["authorization"];
  const { token } = req.body;
  let tokenToBeUsed;

  if (token === false) {
    if (tokenFromHeader === false) {
      return res.status(403).json({ error: "No token provided" });
    }
  }

  console.log(tokenFromHeader);
  console.log("here");

  tokenToBeUsed = token ? token : tokenFromHeader.split(" ")[1];

  jwt.verify(tokenToBeUsed, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
