import express from "express";
import {
    addWishlist,
    deleteWishlist,
    getWishlist,
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
        addWishlist
    );

    router.delete(
        "/:listingId",
        deleteWishlist
    );

    return router;
}