import express from "express";

import {
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomById,
    getRoomImages,
    updateRoomAmenities,
    uploadRoomImage,
    deleteRoomImage,
    setCoverImage,
    getHostRoomById,
} from "../controllers/room.controller.js";

import {
    createRoomSchema,
    updateRoomSchema,
    updateRoomAmenitiesSchema
} from "../validators/schema.validator.js";

import {
    checkJwt,
    attachCurrentUser,
    requireRole,
} from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export default function () {
    const router = express.Router();

    router.get("/host/:roomId",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        getHostRoomById
    );

    router.patch(
        "/images/:imageId/cover",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        setCoverImage
    );

    router.delete(
        "/images/:imageId",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        deleteRoomImage
    );

    router.post(
        "/listings/:listingId",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        validate(createRoomSchema),
        createRoom
    );

    router.patch(
        "/:roomId/amenities",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        validate(updateRoomAmenitiesSchema),
        updateRoomAmenities
    );

    router.post(
        "/:roomId/images",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        upload.single("image"),
        uploadRoomImage
    );

    router.get(
        "/:roomId/images",
        getRoomImages
    );

    router.get("/:roomId",
        getRoomById
    );

    router.patch(
        "/:roomId",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        validate(updateRoomSchema),
        updateRoom
    );

    router.delete(
        "/:roomId",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        deleteRoom
    );

    return router;
}