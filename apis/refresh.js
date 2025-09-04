const jwt = require("jsonwebtoken");
const config = require("../config.js");

const { refresh_Token, access_Token } = config;

module.exports = (app) => {
  app.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, refresh_Token, (err, decoded) => {
      if (err) return res.sendStatus(403); // expired or tampered

      // issue new access token
      const newAccessToken = jwt.sign({ 
        userId: decoded.userId, 
        role: decoded.role },
        access_Token,
        { expiresIn: "1h"}
      );

      localStorage.setItem('accessToken', newAccessToken);

      res.header("Authorization", `Bearer ${newAccessToken}`).send({ success: true });

    });
  })
}
