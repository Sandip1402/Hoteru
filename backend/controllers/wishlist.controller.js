import {
    addToWishlist,
    removeFromWishlist,
    getMyWishlist,
} from "../services/wishlist.service.js";

import { asyncHandler } from "../utils/async-handler.js"

export const addWishlist = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const listingId = Number(req.params.listingId);

    const wishlist = await addToWishlist(userId, listingId);

    res.status(201).json({
        success: true,
        message: "Listing added to wishlist.",
        data: wishlist,
    });
});

export const deleteWishlist = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const listingId = Number(req.params.listingId);

    await removeFromWishlist(userId, listingId);

    res.status(200).json({
        success: true,
        message: "Listing removed from wishlist.",
    });
});

export const getWishlist = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const wishlist = await getMyWishlist(userId);

    res.status(200).json({
        success: true,
        message: "Wishlist fetched successfully.",
        data: wishlist
    });
});