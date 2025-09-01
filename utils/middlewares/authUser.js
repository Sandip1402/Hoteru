const jwt = require('jsonwebtoken');
const dotenvx = require('@dotenvx/dotenvx');
dotenvx.config();

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send('Invalid Token.');
  }
  next();
};

module.exports = authenticate;