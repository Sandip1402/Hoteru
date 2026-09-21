import express from "express";
import { attachCurrentUser, checkJwt, requireRole } from "../middlewares/auth.middleware.js";
import { syncCurrentUser, updateProfileImage, updateUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

export default function () {
  const router = express.Router();

  // used by frontend client only
  // sync Auth0 user with database
  // for new user - gets Auth0 info then creates and updates db with user data
  // for old user - gets Auth0 info then updates db with any new user info
  router.post(
    "/sync",
    checkJwt,
    attachCurrentUser,
    syncCurrentUser
  );

  router.patch(
    "/update",
    checkJwt,
    attachCurrentUser,
    requireRole("basic_user"),
    updateUser
  )

  router.patch(
    "/profile-image",
    checkJwt,
    attachCurrentUser,
    requireRole("basic_user"),
    upload.single("image"),
    updateProfileImage
  )

  return router;
}