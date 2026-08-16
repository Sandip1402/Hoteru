import * as amenityService from "../services/amenity.service.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createAmenity = asyncHandler(async (req, res) => {
  const amenity = await amenityService.createAmenity(req.body);

  res.status(201).json({
    success: true,
    message: "Amenity created successfully.",
    data: amenity,
  });
});

export const updateAmenity = asyncHandler(async (req, res) => {
  const amenityId = Number(req.params.amenityId);

  const amenity = await amenityService.updateAmenity(
    amenityId,
    req.body
  );

  res.json({
    success: true,
    message: "Amenity updated successfully.",
    data: amenity,
  });
});

export const deleteAmenity = asyncHandler(async (req, res) => {
  const amenityId = Number(req.params.amenityId);

  await amenityService.deleteAmenity(amenityId);

  res.json({
    success: true,
    message: "Amenity deleted successfully.",
  });
});

export const getAmenities = asyncHandler(async (req, res) => {
  const amenities = await amenityService.getAmenities();

  res.json({
    success: true,
    data: amenities,
  });
});

export const updateRoomAmenities = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.roomId);
  const room = await amenityService.updateRoomAmenities(
    roomId,
    req.user.id,
    req.body.amenityIds
  );

  res.json({
    success: true,
    message: "Room amenities updated successfully.",
    data: room,
  });
});