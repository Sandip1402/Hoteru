// apis/users.js
import express from 'express'
import checkJwt from '../utils/middlewares/auth.js';
import { findSourceMap } from 'node:module';
const router = express.Router();

export default function (prisma) {
  router.get('/', checkJwt, async (req, res) => {
    // console.log(req.user.sub);
    const auth0Id = req.user.sub;
    const users = await prisma.Users.upsert({
      where: { auth0Id },
      update: {
        email: req.user.email,

      },
      // create: {
      //   auth0Id: req.email.auth0Id,
      //   email: req.user.email,
      //   firstname: 
      // }
    })
    res.json(users);
  });

  return router;
};