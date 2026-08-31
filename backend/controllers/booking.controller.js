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

export const getBookingById = asyncHandler(async (req, res) => {
    const booking = await bookingService.getBookingById(
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
    const { booking, paymentsToRefund } = await bookingService.cancelBooking(
        Number(req.params.bookingId),
        req.user.id,
        req.body.cancellationReason
    );

    // Respond immediately after cancellation.
    res.status(200).json({
        success: true,
        message:
            "Booking cancelled successfully. Refund will be processed shortly.",
        data: {
            booking
        },
    });

    /*
     * Refund after response.
     *
     * Do not let a refund failure change the
     * already-successful cancellation response.
     */
    // Fix need to be updated with redis as backgrorund job
    // should it need to catch any error
    bookingService
        .refundBookingPayments(paymentsToRefund)
        .catch((error) => {
            console.error(
                `Refund processing failed for booking ${booking.bookingId}:`,
                error
            );
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