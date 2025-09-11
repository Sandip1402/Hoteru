const jwt = require('jsonwebtoken');
const dotenvx = require('@dotenvx/dotenvx');
dotenvx.config();

const authUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token){
    res.locals.isAuthenticated = false;
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
    if (err){
      res.locals.isAuthenticated = false;
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.userId = decoded.userId;
    res.locals.isAuthenticated = true;
    res.locals.user = decoded;
    next();
  });

};

module.exports = authUser;