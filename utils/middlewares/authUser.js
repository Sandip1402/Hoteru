const jwt = require('jsonwebtoken');
const dotenvx = require('@dotenvx/dotenvx');
dotenvx.config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403); // token expired or invalid
    req.userId = decoded.userId;
    next();
  });

  next();
};

module.exports = authenticate;