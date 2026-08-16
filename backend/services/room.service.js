import { prisma } from "../lib/prisma.js";
import AppError from "../utils/app-error.js";
import { verifyRoomOwnership } from "../utils/resource.helper.js";
import * as storageService from "./storage.service.js"


export const createRoom = async (hostId, listingId, data) => {
  const listing = await prisma.listing.findUnique({
    where: { listingId },
  });

  if (!listing) {
    throw new AppError(404, "Listing not found.");
  }

  if (listing.ownerId !== hostId) {
    throw new AppError(403, "You do not own this listing.");
  }

  if (listing.status === "PENDING") {
    throw new AppError(400, "You cannot modify rooms while the listing is under review.");
  }

  data.listing = {
    connect: {
      listingId,
    },
  };

  return prisma.room.create({
    data,
  });
};

export const updateRoom = async (roomId, hostId, data) => {
  const room = await verifyRoomOwnership(roomId, hostId);

  return prisma.room.update({
    where: { roomId },
    data,
  });
};

export const deleteRoom = async (roomId, hostId) => {
  const room = await verifyRoomOwnership(roomId, hostId);

  await prisma.room.delete({
    where: { roomId },
  });
};

export const getRoomById = async (roomId) => {
  const room = await prisma.room.findUnique({
    where: { roomId },
    include: {
      images: true,
      amenities: {
        include: {
          amenity: true,
        },
      },
    },
  });

  if (!room) {
    throw new AppError(404, "Room not found.");
  }
  return room;
};

// For Room Image
export const uploadRoomImage = async (roomId, hostId, file) => {
  const room = await verifyRoomOwnership(roomId, hostId);

  const uploadedImage = await storageService.uploadImage(file, "room");

  const imageCount = await prisma.roomImage.count({
    where: { roomId },
  });

  const image = await prisma.roomImage.create({
    data: {
      roomId,
      imageUrl: uploadedImage.imageUrl,
      publicId: uploadedImage.publicId,
      isCover: imageCount === 0,
      displayOrder: imageCount,
    },
  });

  return image;
};

export const getRoomImages = async (roomId) => {
  return prisma.roomImage.findMany({
    where: { roomId },
    orderBy: {
      displayOrder: "asc",
    },
  });
};

export const setCoverImage = async (imageId, hostId) => {
  const image = await prisma.roomImage.findUnique({
    where: { imgId: imageId },
    include: {
      room: {
        include: {
          listing: true,
        },
      },
    },
  });

  if (!image) {
    throw new AppError(404, "Image not found.");
  }

  if (image.room.listing.ownerId !== hostId) {
    throw new AppError(403, "Unauthorized.");
  }

  await prisma.$transaction([
    prisma.roomImage.updateMany({
      where: {
        roomId: image.roomId,
      },
      data: {
        isCover: false,
      },
    }),

    prisma.roomImage.update({
      where: {
        imgId: imageId,
      },
      data: {
        isCover: true,
      },
    }),
  ]);
};

export const deleteRoomImage = async (imageId, hostId) => {
  const image = await prisma.roomImage.findUnique({
    where: { imgId: imageId },
    include: {
      room: {
        include: {
          listing: true,
        },
      },
    },
  });

  if (!image) {
    throw new AppError(404, "Image not found.");
  }

  if (image.room.listing.ownerId !== hostId) {
    throw new AppError(403, "Unauthorized.");
  }

  await storageService.deleteImage(image.publicId);

  await prisma.roomImage.delete({
    where: {
      imgId: imageId, // fix, change in model, imgId -> imageId
    },
  });

  if (image.isThumbnail) {
    const next = await prisma.roomImage.findFirst({
      where: {
        roomId: image.roomId,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    if (next) {
      await prisma.roomImage.update({
        where: {
          imgId: next.imgId,
        },
        data: {
          isCover: true,
        },
      });
    }
  }
};