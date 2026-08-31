import * as roomService from "../services/room.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import AppError from "../utils/app-error.js";

export const getHostRoomById = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.roomId);
  const room = await roomService.getHostRoomById(roomId, req.user.id);

  res.status(200).json({
    success: true,
    message: "Room details for host fetched successfully.",
    data: room,
  });
})

export const createRoom = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.listingId);
  const room = await roomService.createRoom(req.user.id, listingId, req.body);

  res.status(201).json({
    success: true,
    message: "Room created successfully.",
    data: room,
  });
});

export const updateRoom = asyncHandler(async (req, res) => {

  const room = await roomService.updateRoom(
    Number(req.params.roomId),
    req.user.id,
    req.body
  );

  res.json({
    success: true,
    message: "Room updated successfully.",
    data: room,
  });
});

export const deleteRoom = asyncHandler(async (req, res) => {

  await roomService.deleteRoom(
    Number(req.params.roomId),
    req.user.id
  );

  res.json({
    success: true,
    message: "Room deleted successfully.",
  });
});

export const getRoomById = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.roomId);

  const room = await roomService.getRoomById(roomId);

  res.json({
    success: true,
    message: "Room fetched successfully.",
    data: room,
  });
});

export const updateRoomAmenities = asyncHandler(async (req, res) => {
  const roomId = Number(req.params.roomId);
  const room = await roomService.updateRoomAmenities(
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

// For Room Image
export const uploadRoomImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, "Please upload an image for room.");
  }

  const image = await roomService.uploadRoomImage(
    Number(req.params.roomId),
    req.user.id,
    req.file
  );

  return res.status(201).json({
    success: true,
    message: "Room image uploaded successfully.",
    data: image,
  });
});

export const getRoomImages = asyncHandler(async (req, res) => {
  const images = await roomService.getRoomImages(
    Number(req.params.roomId)
  );

  return res.status(200).json({
    success: true,
    message: "Room images fetched successfully.",
    data: images,
  });
});

export const setCoverImage = asyncHandler(async (req, res) => {
  await roomService.setCoverImage(
    Number(req.params.imageId),
    req.user.id
  );

  return res.status(200).json({
    success: true,
    message: "Thumbnail for room updated successfully.",
  });
});

export const deleteRoomImage = asyncHandler(async (req, res) => {
  await roomService.deleteRoomImage(
    Number(req.params.imageId),
    req.user.id
  );

  return res.status(200).json({
    success: true,
    message: "Room Image deleted successfully.",
  });
});