const dotenvx = require('@dotenvx/dotenvx');

dotenvx.config();

module.exports = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DATABASE_URL,
  access_Token: process.env.ACCESS_KEY,
  refresh_Token: process.env.REFRESH_KEY
};