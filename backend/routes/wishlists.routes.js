import express from "express";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "../controllers/wishlist.controller.js";

import { checkJwt, attachCurrentUser } from "../middlewares/auth.middleware.js";

export default function () {
    const router = express.Router();

    router.use(checkJwt, attachCurrentUser);

    router.get(
        "/",
        getWishlist
    );

    router.post(
        "/:listingId",
        addToWishlist
    );

    router.delete(
        "/:listingId",
        removeFromWishlist
    );

    return router;
}