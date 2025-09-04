const dotenvx = require('@dotenvx/dotenvx');

dotenvx.config();

const config = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DB_URL,
  access_Token: process.env.ACCESS_KEY,
  refresh_Token: process.env.REFRESH_KEY
};

module.exports = config;