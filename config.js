const dotenv = require("dotenv");

dotenv.config({path : "./.env"});

const config = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DB_URL,
//   jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;