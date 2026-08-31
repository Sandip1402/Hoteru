import { prisma } from "../lib/prisma.js";
import AppError from "../utils/app-error.js";
import { verifyListingOwnership, verifyRoomOwnership } from "../utils/resource.helper.js";

// Admin
export const createAmenity = async (data) => {
  const name = data.name.trim();

  const existingAmenity = await prisma.amenity.findUnique({
    where: { name },
  });

  if (existingAmenity) {
    throw new AppError(409, "Amenity already exists.");
  }

  return prisma.amenity.create({
    data: {
      ...data,
      name
    }
  });
};

export const updateAmenity = async (amenityId, data) => {
  const amenity = await prisma.amenity.findUnique({
    where: {
      amenityId,
    },
  });

  if (!amenity) {
    throw new AppError(404, "Amenity not found.");
  }

  const name = data.name.trim().toUpperCase();
  if (name) {
    const existingAmenity = await prisma.amenity.findUnique({
      where: { name },
    });

    if (
      existingAmenity &&
      existingAmenity.amenityId !== amenityId
    ) {
      throw new AppError(409, "Amenity already exists.");
    }
  }

  return prisma.amenity.update({
    where: {
      amenityId,
    },
    data: {
      ...data,
      name
    }
  });
};

export const deleteAmenity = async (amenityId) => {
  const amenity = await prisma.amenity.findUnique({
    where: {
      amenityId,
    },
  });

  if (!amenity) {
    throw new AppError(404, "Amenity not found.");
  }

  await prisma.amenity.delete({
    where: {
      amenityId,
    },
  });
};

// Host
export const getAmenities = async () => {
  return prisma.amenity.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
