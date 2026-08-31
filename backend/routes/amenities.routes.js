import express from "express";

import {
  createAmenity,
  updateAmenity,
  deleteAmenity,
  getAmenities,
} from "../controllers/amenity.controller.js";

import {
  checkJwt,
  attachCurrentUser,
  requireRole,
} from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  createAmenitySchema,
  updateAmenitySchema,
} from "../validators/schema.validator.js";

export default function () {
  const router = express.Router();

  // Admin, host
  router.get("/",
    checkJwt,
    attachCurrentUser,
    requireRole("admin", "host"),
    getAmenities
  );

  // Admin
  router.post(
    "/",
    checkJwt,
    attachCurrentUser,
    requireRole("admin"),
    validate(createAmenitySchema),
    createAmenity
  );

  router.patch(
    "/:amenityId",
    checkJwt,
    attachCurrentUser,
    requireRole("admin"),
    validate(updateAmenitySchema),
    updateAmenity
  );

  router.delete(
    "/:amenityId",
    checkJwt,
    attachCurrentUser,
    requireRole("admin"),
    deleteAmenity
  );

  return router;
}