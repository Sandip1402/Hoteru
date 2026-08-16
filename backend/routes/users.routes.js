import express from "express";
import { checkJwt } from "../middlewares/auth.middleware.js";
import { syncCurrentUser } from "../controllers/user.controller.js";

export default function () {
  const router = express.Router();

  router.post("/sync", checkJwt, syncCurrentUser);

  return router;
}