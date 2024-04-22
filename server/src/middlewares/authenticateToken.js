const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  let token = req.headers.authorization;
  token = token.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
