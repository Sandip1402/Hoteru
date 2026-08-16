import express from "express";

import {
  createAmenity,
  updateAmenity,
  deleteAmenity,
  getAmenities,
  updateRoomAmenities,
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
  updateRoomAmenitiesSchema,
} from "../validators/schema.validator.js";

export default function () {
  const router = express.Router();

  // Public
  router.get("/", getAmenities);

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