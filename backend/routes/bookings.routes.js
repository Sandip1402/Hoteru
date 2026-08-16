import express from "express";

import {
    createBooking,
    getMyBookings,
    cancelBooking,
    checkInBooking,
    checkOutBooking,
    getHostBookings,
    getHostBookingById,
    getMyBookingById,
} from "../controllers/booking.controller.js";

import {
    checkJwt,
    attachCurrentUser,
    requireRole,
} from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
    createBookingSchema,
    cancelBookingSchema,
} from "../validators/schema.validator.js";

export default function () {
    const router = express.Router();

    // User static routes
    router.post(
        "/",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        validate(createBookingSchema),
        createBooking
    );

    router.get(
        "/my",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        getMyBookings
    );
    
    router.get(
        "/my/:bookingId",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        getMyBookingById
    );

    router.patch(
        "/my/:bookingId/cancel",
        checkJwt,
        attachCurrentUser,
        requireRole("basic_user"),
        validate(cancelBookingSchema),
        cancelBooking
    );

    // Host static routes
    router.get(
        "/host",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        getHostBookings
    );

    // Dynamic routes
    router.get(
        "/host/:bookingId",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        getHostBookingById
    );
    
    router.patch(
        "/host/:bookingId/checkIn",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        checkInBooking
    );

    router.patch(
        "/host/:bookingId/checkOut",
        checkJwt,
        attachCurrentUser,
        requireRole("host"),
        checkOutBooking
    );

    return router;
}