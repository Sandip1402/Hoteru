import * as wishlistService from "../services/wishlist.service.js";

import { asyncHandler } from "../utils/async-handler.js"

export const addToWishlist = asyncHandler(async (req, res) => {
    const listingId = Number(req.params.listingId);

    const wishlist = await wishlistService.addToWishlist(req.user.id, listingId);

    res.status(201).json({
        success: true,
        message: "Listing added to wishlist successfully.",
        data: wishlist,
    });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
    const listingId = Number(req.params.listingId);

    await wishlistService.removeFromWishlist(req.user.id, listingId);

    res.status(200).json({
        success: true,
        message: "Listing removed from wishlist successfully.",
    });
});

export const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getMyWishlist(req.user.id);

    res.status(200).json({
        success: true,
        message: "Wishlist fetched successfully.",
        data: wishlist
    });
});