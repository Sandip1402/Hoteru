const dotenvx = require('@dotenvx/dotenvx');

dotenvx.config({path : "./.env"});

const config = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DB_URL,
  access_Token: process.env.JWT_SECRET,
  refresh_Token: process.env.REFRESH_SECRET
};

module.exports = config;