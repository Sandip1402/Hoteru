import { prisma } from "../lib/prisma.js";
import { createRefund } from "../lib/razorpay.js";

import AppError from "../utils/app-error.js";

import { getRoomOrThrow } from "../utils/resource.helper.js";
import {
    ensureRoomAvailability,
    calculateNights,
    calculateBookingAmounts,
    generateBookingReference,
    ensureBookingCanBeCancelled,
    ensureBookingCanCheckOut,
    ensureBookingCanCheckIn,
} from "../utils/booking.helper.js";


// For User
export const createBooking = async (guestId, data) => {
    // Get room with listing
    const room = await getRoomOrThrow(data.roomId, {
        include: {
            listing: true,
        },
    });

    // Room must be active
    if (!room.isActive) {
        throw new AppError(400, "Room is not available.");
    }

    // Listing must be approved & active
    if (
        !room.listing.isActive ||
        room.listing.status !== "APPROVED"
    ) {
        throw new AppError(400, "Listing is not available.");
    }

    // Guest capacity
    if (data.guests > room.maxGuests) {
        throw new AppError(
            400,
            `Maximum ${room.maxGuests} guests allowed.`
        );
    }

    // Nights
    const nights = calculateNights(
        data.checkOut,
        data.checkIn
    );

    // V2
    // if (nights < room.minimumStay) {
    //     throw new AppError(
    //         400,
    //         `Minimum stay is ${room.minimumStay} night(s).`
    //     );
    // }

    // Availability
    await ensureRoomAvailability(
        room,
        data.checkOut,
        data.checkIn
    );

    // Pricing
    const pricing = calculateBookingAmounts(
        room,
        nights,
        data.paymentOption
    );

    // Reference
    const bookingReference = generateBookingReference();

    return prisma.$transaction(async (tx) => {
        const booking = await tx.booking.create({
            data: {
                roomName: room.name,

                listingName: room.listing.name,
                thumbnailUrl: room.listing.thumbnailUrl,

                bookingReference,

                checkIn: data.checkIn,
                checkOut: data.checkOut,

                guests: data.guests,

                pricePerNight: pricing.pricePerNight,
                bookingAmount: pricing.bookingAmount,
                remainingAmount: pricing.remainingAmount,
                paidAmount: pricing.paidAmount,
                totalPrice: pricing.totalPrice,

                paymentOption:
                    data.paymentOption,

                status: "AWAITING_PAYMENT",

                paymentStatus: "PENDING",

                // relations
                guest: {
                    connect: {
                        userId: guestId,
                    },
                },
                listing: {
                    connect: {
                        listingId: room.listing.listingId,
                    },
                },
                room: {
                    connect: {
                        roomId: room.roomId
                    }
                }
            },
        });

        return booking;
    });
};

export const getMyBookings = async (guestId) => {
    return prisma.booking.findMany({
        where: { guestId },
        select: {
            bookingId: true,
            bookingReference: true,

            listingId: true,
            listingName: true,
            roomId: true,
            roomName: true,
            thumbnailUrl: true,

            checkIn: true,
            checkOut: true,
            guests: true,

            totalPrice: true,
            status: true,
            paymentStatus: true,

            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getBookingById = async (bookingId, guestId) => {
    const booking = await prisma.booking.findFirst({
        where: {
            bookingId,
            guestId,
        },
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    return booking;
}

export const cancelBooking = async (bookingId, guestId, reason) => {
    const booking = await prisma.booking.findFirst({
        where: {
            bookingId,
            guestId,
        },
        include: {
            payments: {
                where: {
                    status: "SUCCESS",
                    mode: "ONLINE"
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!booking) {
        throw new AppError(404, "Booking not found.");
    }

    ensureBookingCanBeCancelled(booking);

    const cancelledBooking =
        await prisma.booking.update({
            where: {
                bookingId,
            },
            data: {
                status: "CANCELLED",
                cancellationReason: reason,
                cancelledAt: new Date(),
            },
        });

    return {
        booking: cancelledBooking,
        paymentsToRefund: booking.payments,
    };
}


// For Hosts
export const getHostBookings = async (hostId) => {
    return prisma.booking.findMany({
        where: {
            room: {
                listing: {
                    ownerId: hostId,
                },
            },
        },

        include: {
            guest: {
                select: {
                    userId: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                },
            },
        },

        orderBy: {
            checkIn: "asc",
        },
    });
};

export const getHostBookingById = async (
    bookingId,
    hostId
) => {
    const booking =
        await prisma.booking.findFirst({
            where: {
                bookingId,

                room: {
                    listing: {
                        ownerId: hostId,
                    },
                },
            },

            include: {
                guest: true,
                payments: true,
            },
        });

    if (!booking) {
        throw new AppError(
            404,
            "Booking not found."
        );
    }

    return booking;
};

export const checkInBooking = async (
    bookingId,
    hostId
) => {
    const booking =
        await getHostBookingById(
            bookingId,
            hostId
        );

    ensureBookingCanCheckIn(
        booking
    );

    return prisma.booking.update({
        where: {
            bookingId,
        },

        data: {
            status: "CHECKED_IN",
        },
    });
};

export const checkOutBooking = async (
    bookingId,
    hostId
) => {
    const booking =
        await getHostBookingById(
            bookingId,
            hostId
        );

    ensureBookingCanCheckOut(
        booking
    );

    return prisma.booking.update({
        where: {
            bookingId,
        },

        data: {
            status: "CHECKED_OUT",
        },
    });
};

export const refundBookingPayments = async (
    payments
) => {
    const results = [];

    for (const payment of payments) {
        try {
            // Refund through razorpay first
            const refund = await createRefund({
                paymentId: payment.gatewayPaymentId,
                amount: payment.amount,
            });

            // mark payment as REFUNDED after
            // successful process of Razorpay refund
            const updatedPayment =
                await prisma.payment.update({
                    where: {
                        paymentId: payment.paymentId,
                    },
                    data: {
                        status: "REFUNDED",
                    },
                });

            results.push({
                paymentId: updatedPayment.paymentId,
                amount: payment.amount,
                refundId: refund.id,
                status: "REFUNDED",
            });

        } catch (error) {
            console.error(
                `Refund failed for payment ${payment.paymentId}:`, error
            );

            results.push({
                paymentId: payment.paymentId,
                amount: payment.amount,
                status: "REFUND_FAILED", // fix
            });
        }
    }

    return results;
};