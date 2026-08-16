import { prisma } from "../lib/prisma.js";
import AppError from "../utils/app-error.js";


// Listing

export const getListingOrThrow = async (listingId) => {
    const listing = await prisma.listing.findUnique({
        where: {
            listingId,
        },
    });

    if (!listing) {
        throw new AppError(404, "Listing not found.");
    }

    return listing;
};

export const verifyListingOwnership = async (
    listingId,
    hostId
) => {
    const listing = await getListingOrThrow(listingId);

    if (listing.ownerId !== hostId) {
        throw new AppError(403, "You do not own this listing.");
    }

    return listing;
};


// Listing Image

export const getListingImageOrThrow = async (imageId) => {
    const image = await prisma.listingImage.findUnique({
        where: { imageId },
        include: {
            listing: true,
        },
    });

    if (!image) {
        throw new AppError(404, "Image not found.");
    }

    return image;
};

export const verifyListingImageOwnership = async (imageId, hostId) => {
    const image = await getListingImageOrThrow(imageId);

    if (image.listing.ownerId !== hostId) {
        throw new AppError(403, "Forbidden.");
    }

    return image;
};


// Room

export const getRoomOrThrow = async (
    roomId,
    options = {}
    /* example
        include: {
        listing: true,
        amenities: true,
        images: true,
        }, 
    */
) => {
    const room = await prisma.room.findUnique({
        where: { roomId },
        ...options,
    });

    if (!room) {
        throw new AppError(404, "Room not found.");
    }

    return room;
};

export const verifyRoomOwnership = async (
    roomId,
    hostId
) => {
    const room = await getRoomOrThrow(roomId,
        {
            include: {
                listing: {
                    select: {
                        ownerId: true,
                        name: true,
                    },
                },
            },
        });

    if (room.listing.ownerId !== hostId) {
        throw new AppError(
            403,
            "You do not own this room."
        );
    }

    return room;
};


// Review

export const getReviewOrThrow = async (
    reviewId,
    options = {}
) => {
    const review = await prisma.review.findUnique({
        where: {
            reviewId,
        },
        ...options,
    });

    if (!review) {
        throw new AppError(404, "Review not found.");
    }

    return review;
};