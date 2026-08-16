import { prisma } from "../lib/prisma.js";
import AppError from "../utils/App-Error.js";

export const addToWishlist = async (userId, listingId) => {
    const listing = await prisma.listing.findUnique({
        where: { listingId },
        select: {
            listingId: true,
            status: true,
            isActive: true,
        },
    });

    if (!listing) {
        throw new AppError(404, "Listing not found.");
    }

    if (listing.status !== "APPROVED" || !listing.isActive) {
        throw new AppError(400, "This listing cannot be added to wishlist.");
    }

    const existing = await prisma.wishlist.findUnique({
        where: {
            userId_listingId: {
                userId,
                listingId,
            },
        },
    });

    if (existing) {
        throw new AppError(409, "Listing is already in your wishlist.");
    }

    return prisma.wishlist.create({
        data: {
            userId,
            listingId,
        },
    });
};

export const removeFromWishlist = async (userId, listingId) => {
    const wishlist = await prisma.wishlist.findUnique({
        where: {
            userId_listingId: {
                userId,
                listingId,
            },
        },
    });

    if (!wishlist) {
        throw new AppError(404, "Listing is not in your wishlist.");
    }

    await prisma.wishlist.delete({
        where: {
            userId_listingId: {
                userId,
                listingId,
            },
        },
    });
};

export const getMyWishlist = async (userId) => {
    return prisma.wishlist.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            listing: {
                include: {
                    images: true,
                    rooms: true,
                },
            },
        },
    });
};