import * as listingService from "../services/listing.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import AppError from "../utils/app-error.js";

// Public
export const getListings = asyncHandler(async (req, res) => {
  const result = await listingService.getListings(req.query);

  return res.status(200).json({
    success: true,
    message: "Listings fetched successfully.",
    data: result.listings,
    pagination: result.pagination,
  });
});

export const getPublicListing = asyncHandler(async (req, res) => {
  const listing = await listingService.getPublicListing(
    Number(req.params.listingId)
  )

  res.status(200).json({
    success: true,
    message: "Listing fetched for public successfully.",
    data: listing,
  });
})

// Host
export const createListing = asyncHandler(async (req, res) => {
  const listing = await listingService.createListing(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Listing created successfully.",
    data: listing,
  });
});

export const getMyListings = asyncHandler(async (req, res) => {
  const listings = await listingService.getMyListings(req.user.id);

  return res.status(200).json({
    success: true,
    message: "Listings fetched successfully.",
    data: listings,
  });
});

export const getHostListingById = asyncHandler(async (req, res) => {
  const listing = await listingService.getHostListingById(
    Number(req.params.listingId),
    req.user.id
  )

  res.status(200).json({
    success: true,
    message: "Listing fetched for host successfully.",
    data: listing,
  });
})

export const updateListing = asyncHandler(async (req, res) => {
  const listing = await listingService.updateListing(
    Number(req.params.listingId),
    req.user.id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Listing updated successfully.",
    data: listing,
  });
});

export const setThumbnail = asyncHandler(async (req, res) => {
  await listingService.setThumbnail(
    Number(req.params.imageId),
    req.user.id
  );

  return res.status(200).json({
    success: true,
    message: "Thumbnail for listing updated successfully.",
  });
});

export const updateListingAmenities = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.listingId);

  await listingService.updateListingAmenities(
    listingId,
    req.user.id,
    req.body.amenityIds
  );

  res.status(200).json({
    success: true,
    message: "Listing amenities updated successfully.",
  });
})

export const submitListing = asyncHandler(async (req, res) => {
  const listing = await listingService.submitListing(
    Number(req.params.listingId),
    req.user.id
  );

  return res.status(200).json({
    success: true,
    message: "Listing submitted for review.",
    data: listing,
  });
});

export const deleteListing = asyncHandler(async (req, res) => {
  await listingService.deleteListing(
    Number(req.params.listingId),
    req.user.id,
  );

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully.",
  });
});

// For Listing Image
export const getListingImages = asyncHandler(async (req, res) => {
  const images = await listingService.getListingImages(
    Number(req.params.listingId)
  );

  return res.status(200).json({
    success: true,
    message: "Listing images fetched successfully.",
    data: images,
  });
});

export const uploadListingImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, "Please upload an image for listing.");
  }

  const image = await listingService.uploadListingImage(
    Number(req.params.listingId),
    req.user.id,
    req.file,
    req.body.caption
  );

  return res.status(201).json({
    success: true,
    message: "Listing image uploaded successfully.",
    data: image,
  });
});

export const deleteListingImage = asyncHandler(async (req, res) => {
  await listingService.deleteListingImage(
    Number(req.params.listingId),
    Number(req.params.imageId),
    req.user.id
  );

  return res.status(200).json({
    success: true,
    message: "Listing image deleted successfully.",
  });
});

export const getListingRooms = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.listingId);

  const rooms = await listingService.getListingRooms(listingId);

  res.json({
    success: true,
    data: rooms,
  });
});

// for Host
export const getRooms = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.listingId);

  const rooms = await listingService.getRooms(listingId, req.user.id);

  res.json({
    success: true,
    message: "Rooms fetched successfully.",
    data: rooms,
  });
});

// Admin
export const getPendingListings = asyncHandler(async (req, res) => {
  const listings = await listingService.getPendingListings();

  return res.status(200).json({
    success: true,
    message: "Pending listings fetched successfully.",
    data: listings,
  });
});

export const getAdminListingById = asyncHandler(async (req, res) => {
  const listing = await listingService.getAdminListingById(
    Number(req.params.listingId)
  )

  res.status(200).json({
    success: true,
    message: "Listing fetched for admin successfully.",
    data: listing,
  });
})

export const reviewListing = asyncHandler(async (req, res) => {
  const { action, adminNotes } = req.body;
  const listing = await listingService.reviewListing(
    Number(req.params.listingId),
    req.user.id,
    action,
    adminNotes
  );

  return res.status(200).json({
    success: true,
    message: "Listing reviewed successfully",
    data: listing,
  });
});