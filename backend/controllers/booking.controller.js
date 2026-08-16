import * as bookingService from "../services/booking.service.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.createBooking(
        req.user.id,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Booking created successfully.",
        data: booking,
    });
});

export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.getMyBookings(
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully.",
        data: bookings,
    });
});

export const getMyBookingById = asyncHandler(async (req, res) => {
    const booking = await bookingService.getMyBookingById(
        Number(req.params.bookingId),
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Booking retrieved successfully.",
        data: booking,
    });
});

export const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.cancelBooking(
        Number(req.params.bookingId),
        req.user.id,
        req.body.cancellationReason
    );

    res.status(200).json({
        success: true,
        message: "Booking cancelled successfully.",
        data: booking,
    });
});


// For Host
export const getHostBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.getHostBookings(req.user.id);

    res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully.",
        data: bookings,
    });
});

export const getHostBookingById = asyncHandler(async (req, res) => {
    const booking = await bookingService.getHostBookingById(
        Number(req.params.bookingId),
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Booking retrieved successfully.",
        data: booking,
    });
});

export const checkInBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.checkInBooking(
        Number(req.params.bookingId),
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Booking checked in successfully.",
        data: booking,
    });
});

export const checkOutBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.checkOutBooking(
        Number(req.params.bookingId),
        req.user.id
    ); 

    res.status(200).json({
        success: true,
        message: "Booking checked out successfully.",
        data: booking,
    });
});