import express from "express";

import {
  createListing,
  getListings,
  getMyListings,
  getPendingListings,
  getPublicListing,
  getHostListingById,
  getAdminListingById,
  updateListing,
  deleteListing,
  reviewListing,
  submitListing,
  uploadListingImage,
  getListingImages,
  getListingRooms,
  setThumbnail,
  deleteListingImage,
  updateListingAmenities,
  getRooms
} from "../controllers/listing.controller.js";

import {
  createListingSchema,
  updateListingSchema,
  reviewListingSchema,
  updateListingAmenitiesSchema
} from "../validators/schema.validator.js";

import {
  checkJwt,
  attachCurrentUser,
  requireRole,
} from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export default function () {

  const router = express.Router();

  router.get("/", getListings);

  router.post(
    "/",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    validate(createListingSchema),
    createListing
  );

  router.get(
    "/my",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    getMyListings
  );

  router.get(
    "/my/:listingId",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    getHostListingById
  );

  router.get(
    "/my/:listingId/rooms",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    getRooms
  );

  router.get(
    "/pending",
    checkJwt,
    attachCurrentUser,
    requireRole("admin"),
    getPendingListings
  );

  router.get(
    "/admin/:listingId",
    checkJwt,
    attachCurrentUser,
    requireRole("admin"),
    getAdminListingById
  );

  router.patch(
    "/images/:imageId/thumbnail",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    setThumbnail
  );

  router.delete(
    "/images/:imageId",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    deleteListingImage
  );

  router.patch(
    "/:listingId/amenities",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    validate(updateListingAmenitiesSchema),
    updateListingAmenities
  );

  router.get(
    "/:listingId/images",
    getListingImages
  );

  router.get("/:listingId/rooms", // public
    getListingRooms
  );

  router.post(
    "/:listingId/images",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    upload.single("image"),
    uploadListingImage
  );

  router.patch(
    "/:listingId/submit",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    submitListing
  );

  router.patch(
    "/:listingId/review",
    checkJwt,
    attachCurrentUser,
    requireRole("admin"),
    validate(reviewListingSchema),
    reviewListing
  );

  router.get(
    "/:listingId",
    getPublicListing
  );

  router.patch(
    "/:listingId",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    validate(updateListingSchema),
    updateListing
  );

  router.delete(
    "/:listingId",
    checkJwt,
    attachCurrentUser,
    requireRole("host"),
    deleteListing
  );

  return router;
}