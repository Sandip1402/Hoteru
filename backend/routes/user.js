// apis/users.js
import express from 'express'
const router = express.Router();
import { checkJwt } from '../auth/middlewares.js';

export default function (prisma) {
  router.get('/', checkJwt, async (req, res) => {
    console.log(req.user.sub);
    
    // fix : look out sub, then add all info according to schema
    
    // const auth0Id = req.user.sub; // very important
    // const users = await prisma.Users.upsert({
    //   where: { auth0Id },
    //   update: {
    //     email: req.user.email,
    //     firstname: req.user.given_name,
    //     lastname: req.user.family_name,
    //   },
    //   create: {
    //     auth0Id: auth0Id,
    //     email: req.user.email,
    //     firstname: req.user.given_name,
    //     lastname: req.user.family_name,
    //   }
    // })
    // res.json(users);
  });

  return router;
};