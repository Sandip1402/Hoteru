import crypto from "crypto";
import { differenceInCalendarDays } from "date-fns";

import { prisma } from "../lib/prisma.js";
import AppError from "../utils/app-error.js";
import { getRoomOrThrow } from "./resource.helper.js";
import { env } from "../config.js";

export const ensureRoomAvailability = async (
    room,
    checkOut,
    checkIn,
) => {

    const overlappingBookings = await prisma.booking.count({
        where: {
            roomId: room.roomId,

            status: {
                in: [
                    "CONFIRMED",
                    "CHECKED_IN",
                ],
            },

            checkIn: {
                lt: checkOut,
            },

            checkOut: {
                gt: checkIn,
            },
        },
    });

    if (overlappingBookings >= room.quantity) {
        throw new AppError(409, "Room not available for the selected dates.");
    }

    return room;
};

export const calculateBookingAmounts = (
    room,
    nights,
    paymentOption
) => {
    const pricePerNight = Number(room.baseprice); // fix room doesn't have pricePerNight

    const totalPrice = pricePerNight * nights;

    const bookingPercentage = env.BOOKING_PERCENTAGE;

    const bookingAmount =
        paymentOption === "PAY_NOW"
            ? totalPrice
            : totalPrice * bookingPercentage;

    const remainingAmount = totalPrice - bookingAmount;

    const paidAmount =
        paymentOption === "PAY_NOW"
            ? totalPrice
            : bookingAmount;

    return {
        pricePerNight,
        totalPrice,
        bookingAmount,
        remainingAmount,
        paidAmount,
    };
};

export const calculateNights = (checkOut, checkIn) => {
    return differenceInCalendarDays(checkOut, checkIn);
};

export const generateBookingReference = () => {
    const date = new Date();

    const yyyy = date.getFullYear();

    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const dd = String(date.getDate()).padStart(2, "0");

    const random = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    return `HTR-${yyyy}${mm}${dd}-${random}`;
};

export const ensureBookingCanBeCancelled = (booking) => {
    const cancellableStatuses = ["AWAITING_PAYMENT", "CONFIRMED"];

    if (!cancellableStatuses.includes(booking.status)) {
        throw new AppError(
            400,
            `Booking cannot be cancelled, booking already ${booking.status}.`
        );
    }
};

export const ensureBookingCanCheckIn = (
    booking
) => {
    if ( booking.status !== "CONFIRMED" ) {
        throw new AppError(
            400,
            "Booking cannot be checked in."
        );
    }
};

export const ensureBookingCanCheckOut = (
    booking
) => {
    if ( booking.status !== "CHECKED_IN" ) {
        throw new AppError(
            400,
            "Booking cannot be checked out."
        );
    }
}