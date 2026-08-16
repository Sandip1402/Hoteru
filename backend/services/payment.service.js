import { prisma } from "../lib/prisma.js";
import { createOrder } from "../lib/razorpay.js";

import AppError from "../utils/app-error.js";

export const createPaymentOrder = async ({
    userId,
    bookingId,
    purpose,
}) => {
    const booking = await prisma.booking.findFirst({
        where: {
            bookingId,
            guestId: userId,
        },
    });

    if (!booking) {
        throw new AppError(404, "Booking not found.");
    }

    if (booking.status !== "AWAITING_PAYMENT") {
        throw new AppError(
            400,
            "This booking is not awaiting payment."
        );
    }

    let amount;

    if (purpose === "BOOKING") {
        if (booking.paymentStatus !== "PENDING") {
            throw new AppError(
                400,
                "Initial booking payment has already been processed."
            );
        }

        amount =
            booking.paymentOption === "PAY_NOW"
                ? Number(booking.totalPrice)
                : Number(booking.bookingAmount);
    }

    if (purpose === "REMAINING") {
        if (booking.paymentOption !== "PAY_PARTIALLY") {
            throw new AppError(
                400,
                "This booking does not have a remaining payment."
            );
        }

        if (booking.paymentStatus !== "PARTIALLY_PAID") {
            throw new AppError(
                400,
                "There is no remaining payment for this booking."
            );
        }

        amount = Number(booking.remainingAmount);
    }

    if (!amount || amount <= 0) {
        throw new AppError(400, "Invalid payment amount.");
    }

    const payment = await prisma.payment.create({
        data: {
            bookingId: booking.bookingId,
            amount,
            purpose,
            gateway: "RAZORPAY",
            status: "PENDING",
        },
    });

    try {
        const order = await createOrder({
            amount,
            receipt: booking.bookingReference,
        });

        const updatedPayment = await prisma.payment.update({
            where: {
                paymentId: payment.paymentId,
            },
            data: {
                gatewayOrderId: order.id,
            },
        });

        return {
            paymentId: updatedPayment.paymentId,
            orderId: order.id,
            amount,
            currency: "INR",
        };
    } catch (error) {
        await prisma.payment.update({
            where: {
                paymentId: payment.paymentId,
            },
            data: {
                status: "FAILED",
            },
        });

        throw error;
    }
};

export const verifyPayment = async ({
    userId,
    paymentId,
    orderId,
    razorpayPaymentId,
    signature,
}) => {
    const payment = await prisma.payment.findFirst({
        where: {
            paymentId,
            booking: {
                guestId: userId,
            },
        },
        include: {
            booking: true,
        },
    });

    if (!payment) {
        throw new AppError(404, "Payment not found.");
    }

    if (payment.status === "PAID") {
        throw new AppError(400, "Payment has already been verified.");
    }

    if (payment.gateway !== "RAZORPAY") {
        throw new AppError(400, "Unsupported payment gateway.");
    }

    if (payment.gatewayOrderId !== orderId) {
        throw new AppError(400, "Invalid payment order.");
    }

    const isValid = verifyPaymentSignature({
        orderId,
        paymentId: razorpayPaymentId,
        signature,
    });

    if (!isValid) {
        await prisma.payment.update({
            where: {
                paymentId: payment.paymentId,
            },
            data: {
                status: "FAILED",
            },
        });

        throw new AppError(400, "Payment verification failed.");
    }

    const booking = payment.booking;

    const result = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
            where: {
                paymentId: payment.paymentId,
            },
            data: {
                status: "PAID",
                gatewayPaymentId: razorpayPaymentId,
                gatewaySignature: signature,
                // method: "UPI", // fix
                paidAt: new Date(),
            },
        });

        const newPaidAmount =
            Number(booking.paidAmount) + Number(payment.amount);

        const newRemainingAmount =
            Number(booking.totalPrice) - newPaidAmount;

        const updatedBooking = await tx.booking.update({
            where: {
                bookingId: booking.bookingId,
            },
            data: {
                paidAmount: newPaidAmount,
                remainingAmount: newRemainingAmount,
                paymentStatus:
                    newRemainingAmount <= 0
                        ? "PAID"
                        : "PARTIALLY_PAID",
                status:
                    newRemainingAmount <= 0
                        ? "CONFIRMED"
                        : "AWAITING_PAYMENT",
            },
        });

        return {
            payment: updatedPayment,
            booking: updatedBooking,
        };
    });

    return result;
};