import express from "express";
import { attachCurrentUser, checkJwt } from "../middlewares/auth.middleware.js";
import { syncCurrentUser } from "../controllers/user.controller.js";

export default function () {
  const router = express.Router();

  // used by frontend client only
  // sync Auth0 user with database
  // for new user - gets Auth0 info then creates and updates db with user data
  // for old user - gets Auth0 info then updates db with any new user info
  router.post("/sync", checkJwt, attachCurrentUser, syncCurrentUser);

  return router;
}