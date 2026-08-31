import { prisma } from "../lib/prisma.js";
import AppError from "../utils/app-error.js";
import { getPagination } from "../utils/pagination.js";
import { buildListingFilters } from "../utils/listing-filters.js";
import {
  getListingOrThrow,
  verifyListingImageOwnership,
  verifyListingOwnership
} from "../utils/resource.helper.js";
import * as storageService from "./storage.service.js"
import {
  adminListingSelect,
  hostListingSelect,
  publicListingDetailSelect,
  publicListingSummarySelect,
} from "../utils/listing.helper.js";

// public
export const getListings = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildListingFilters(query);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      select: publicListingSummarySelect,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPublicListing = async (listingId) => {
  const listing = await prisma.listing.findFirst({
    where: {
      listingId,
      status: "APPROVED",
      isActive: true,
    },

    select: {
      ...publicListingDetailSelect,

      images: {
        select: {
          imageId: true,
          imageUrl: true,
          caption: true,
          isThumbnail: true,
          displayOrder: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },

      amenities: {
        select: {
          amenity: true,
        }
      },
    }
  })

  if (!listing) {
    throw new AppError(404, "Listing not found.");
  }
  return listing;
};

// Host
export const createListing = async (ownerId, listingData) => {
  return prisma.listing.create({
    data: {
      ownerId,
      status: "DRAFT",
      ...listingData,
    },
  });
};

export const getMyListings = async (ownerId) => {
  return prisma.listing.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getHostListingById = async (listingId, hostId) => {
  const listing = await prisma.listing.findFirst({
    where: {
      listingId,
      ownerId: hostId,
    },
    include: hostListingSelect,
  });

  if (!listing) {
    throw new AppError(404, "Listing not found.");
  }

  return listing;
};

export const updateListing = async (listingId, hostId, data) => {
  const listing = await getListingOrThrow(listingId);

  if (listing.ownerId !== hostId) {
    throw new AppError(403, "You are not allowed to update this listing.");
  }

  return prisma.listing.update({
    where: { listingId },
    data,
  });
};

export const updateListingAmenities = async (
  listingId,
  hostId,
  amenityIds
) => {
  await verifyListingOwnership(listingId, hostId);

  const amenitiesCount = await prisma.amenity.count({
    where: {
      amenityId: {
        in: amenityIds,
      },
    },
  });

  if (amenitiesCount !== amenityIds.length) {
    throw new AppError(400, "One or more amenities are invalid.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.listingAmenity.deleteMany({
      where: {
        listingId,
      },
    });

    if (amenityIds.length > 0) {
      await tx.listingAmenity.createMany({
        data: amenityIds.map((amenityId) => ({
          listingId,
          amenityId,
        })),
      });
    }
  });
};

export const submitListing = async (listingId, userId) => {
  const listing = await verifyListingOwnership(listingId, userId);

  if (!["DRAFT", "REJECTED"].includes(listing.status)) {
    throw new AppError(
      400,
      "Only draft or rejected listings can be submitted."
    );
  }

  // Fetch the data required to validate submission
  const listingData = await prisma.listing.findUnique({
    where: {
      listingId,
    },
    include: {
      images: {
        select: {
          imageId: true,
          isThumbnail: true,
        },
      },
      rooms: {
        where: {
          isActive: true,
        },
        select: {
          roomId: true,
          name: true,
          maxGuests: true,
          beds: true,
          bathrooms: true,
          basePrice: true,
          quantity: true,
          images: {
            select: {
              imageId: true,
            },
          },
        },
      },
    },
  });

  // Required listing fields - already checked by create / update validators

  // Listing must have at least one image
  if (listingData.images.length === 0) {
    throw new AppError(
      400,
      "Listing must have at least one image."
    );
  }

  // Listing must have a thumbnail
  const hasThumbnail = listingData.images.some(
    (image) => image.isThumbnail
  );

  if (!hasThumbnail) {
    throw new AppError(
      400,
      "Listing must have a thumbnail image."
    );
  }

  // Listing must have at least one active room
  if (listingData.rooms.length === 0) {
    throw new AppError(
      400,
      "Listing must have at least one active room."
    );
  }

  // Validate active rooms
  for (const room of listingData.rooms) {
    if (room.images.length === 0) {
      throw new AppError(
        400,
        `Room "${room.name}" must have at least one image.`
      );
    }
  }

  return prisma.listing.update({
    where: {
      listingId,
    },
    data: {
      status: "PENDING",
      adminNotes: null,
      reviewedAt: null,
    },
  });
};

export const deleteListing = async (listingId, ownerId) => {
  const listing = await getListingOrThrow(listingId);

  if (listing.ownerId !== ownerId) {
    throw new AppError(403, "You are not allowed to delete this listing.");
  }

  await prisma.listing.delete({
    where: { listingId },
  });
};


// For Listing Image
export const uploadListingImage = async (
  listingId,
  hostId,
  file,
  caption
) => {
  const listing = await verifyListingOwnership(listingId, hostId);

  const uploadedImage = await storageService.uploadImage(file, "listing");

  // First image automatically becomes thumbnail
  const imageCount = await prisma.listingImage.count({
    where: { listingId },
  });

  const image = await prisma.listingImage.create({
    data: {
      listingId: listing.listingId,
      imageUrl: uploadedImage.imageUrl,
      publicId: uploadedImage.publicId,
      caption,
      isThumbnail: imageCount === 0,
      displayOrder: imageCount,
    },
  });

  if (imageCount === 0) {
    await prisma.listing.update({
      where: { listingId },
      data: {
        thumbnailUrl: image.imageUrl,
      },
    });
  }

  return image;
};

export const getListingImages = async (listingId) => {
  return prisma.listingImage.findMany({
    where: {
      listingId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getListingRooms = async (listingId) => {
  return prisma.room.findMany({
    where: {
      listingId,
      isActive: true,
    },
    select: {
      roomId: true,
      name: true,
      roomType: true,

      bedrooms: true,
      beds: true,

      maxGuests: true,

      basePrice: true,

      images: {
        select: {
          imageId: true,
          altText: true,
          imageUrl: true,
          isCover: true,
          displayOrder: true,
        },
        orderBy: {
          displayOrder: "asc"
        }
      }
    },
    orderBy: {
      basePrice: "asc",
    },
  });
};

// for Host
export const getRooms = async (listingId, hostId) => {
  await verifyListingOwnership(listingId, hostId);

  return prisma.room.findMany({
    where: { listingId },
    include: {
      listing: {
        select: {
          ownerId: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const setThumbnail = async (imageId, ownerId) => {
  const image = await verifyListingImageOwnership(imageId, ownerId);

  await prisma.$transaction(async (tx) => {
    await tx.listingImage.updateMany({
      where: {
        listingId: image.listingId,
      },
      data: {
        isThumbnail: false,
      },
    });

    await tx.listingImage.update({
      where: {
        imageId,
      },
      data: {
        isThumbnail: true,
      },
    });

    await tx.listing.update({
      where: {
        listingId: image.listingId,
      },
      data: {
        thumbnailUrl: image.imageUrl,
      },
    });
  });

  return true;
};

export const deleteListingImage = async (listingId, imageId, hostId) => {
  const image = await verifyListingImageOwnership(listingId, imageId, hostId);
  console.log(image);
  await storageService.deleteImage(image.publicId);

  await prisma.$transaction(async (tx) => {
    await tx.listingImage.delete({
      where: {
        imageId,
      },
    });

    if (image.isThumbnail) {
      const nextImage = await tx.listingImage.findFirst({
        where: {
          listingId: image.listingId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (nextImage) {
        await tx.listingImage.update({
          where: {
            imageId: nextImage.imageId,
          },
          data: {
            isThumbnail: true,
          },
        });

        await tx.listing.update({
          where: {
            listingId: image.listingId,
          },
          data: {
            thumbnailUrl: nextImage.imageUrl,
          },
        });
      } else {
        await tx.listing.update({
          where: {
            listingId: image.listingId,
          },
          data: {
            thumbnailUrl: null,
          },
        });
      }
    }
  });

  return true;
};

// Admin
export const getPendingListings = async () => {
  return prisma.listing.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      owner: {
        select: {
          userId: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getAdminListingById = async (listingId) => {
  const listing = await prisma.listing.findUnique({
    where: {
      listingId,
    },

    include: adminListingSelect
  })
  if (!listing) {
    throw new AppError(404, "Listing not found.");
  }

  return listing;
}

export const reviewListing = async (
  listingId,
  adminId,
  action,
  adminNotes
) => {
  const listing = await getListingOrThrow(listingId);

  if (listing.status !== "PENDING") {
    throw new AppError(400, "Listing has already been reviewed.");
  }

  return prisma.listing.update({
    where: {
      listingId,
    },
    data: {
      status: action === "APPROVE"
        ? "APPROVED"
        : "REJECTED",

      adminNotes,

      approvedById: adminId,

      reviewedAt: new Date(),

      publishedAt:
        action === "APPROVE"
          ? new Date()
          : null,
    }
  });
};