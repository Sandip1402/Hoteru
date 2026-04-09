// apis/users.js
const express = require('express');
const router = express.Router();

module.exports = function (prisma) {
  router.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });

  return router;
};