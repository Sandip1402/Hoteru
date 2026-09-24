import { prisma } from "../lib/prisma.js";

export const addToWishlist = async (userId, listingId) => {
    return prisma.wishlist.upsert({
        where: {
            userId_listingId: {
                userId,
                listingId,
            },
        },
        update: {}, // Avoids unique constraint error if already added
        create: {
            userId,
            listingId,
        },
    });
};

export const removeFromWishlist = async (userId, listingId) => {
    return prisma.wishlist.deleteMany({
        where: {
            userId,
            listingId,
        },
    });
};

export const getMyWishlist = async (userId) => {
    return prisma.wishlist.findMany({
        where: {
            userId,
            listing: {
                isActive: true,
                status: 'APPROVED'
            }
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            listing: {
                select: {
                    listingId: true,
                    name: true,
                    thumbnailUrl: true,
                    type: true,
                    city: true,
                    state: true,
                    country: true,
                    averageRating: true,
                    reviewCount: true,
                }
            },
        },
    });
};