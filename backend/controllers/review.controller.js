import { asyncHandler } from "../utils/async-handler.js";
import * as reviewService from "../services/review.service.js"


export const createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview(
        req.user.id,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Review submitted successfully.",
        data: review
    });
});

export const updateReview = asyncHandler(async (req, res) => {
    const review = await reviewService.updateReview(
        Number(req.params.reviewId),
        req.user.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Review updated successfully.",
        data: review
    });
});

export const deleteReview = asyncHandler(async (req, res) => {
    await reviewService.deleteReview(
        Number(req.params.reviewId),
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
    });
});

export const getListingReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getListingReviews(
        Number(req.params.listingId)
    );

    res.status(200).json({
        success: true,
        message: "Reviews fetched successfully.",
        data: reviews
    });
});

export const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getMyReviews(req.user.id);

    res.status(200).json({
        success: true,
        data: reviews,
    });
});