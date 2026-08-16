import express from "express";

import {
    createReview,
    updateReview,
    deleteReview,
    getListingReviews,
    getMyReviews
} from "../controllers/review.controller.js";

import {
    checkJwt,
    attachCurrentUser,
    requireRole,
} from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
    createReviewSchema,
    updateReviewSchema,
} from "../validators/schema.validator.js";

export default function () {
    const router = express.Router();

    // ---------- Public ----------
    router.get(
        "/listing/:listingId",
        getListingReviews
    );

    // ---------- User ----------
    router.post("/",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        validate(createReviewSchema),
        createReview
    );

    router.get("/my",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        getMyReviews
    );

    router.patch(
        "/my/:reviewId",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        validate(updateReviewSchema),
        updateReview
    );

    router.delete(
        "/my/:reviewId",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        deleteReview
    );

    return router;
}