import { prisma } from "../lib/prisma.js";
import { createOrder, fetchPayment, verifyPaymentSignature } from "../lib/razorpay.js";

import AppError from "../utils/app-error.js";

export const createPaymentOrder = async (
    userId,
    bookingId,
    purpose,
) => {
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
        if (
            booking.paymentOption !== "BOOK_ONLY" ||
            Number(booking.remainingAmount) <= 0
        ) {
            throw new AppError(
                400,
                "This booking does not have a remaining payment."
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
            mode: "ONLINE",
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
    gatewayPaymentId,
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

    if (payment.status === "SUCCESS") {
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
        paymentId: gatewayPaymentId,
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

    const newPaidAmount =
        Number(booking.paidAmount) + Number(payment.amount);

    const newRemainingAmount = Math.max(
        0,
        Number(booking.totalPrice) - newPaidAmount
    );

    const isFullyPaid = newRemainingAmount <= 0;

    const razorpayPayment = await fetchPayment(gatewayPaymentId);

    if (razorpayPayment.order_id !== payment.gatewayOrderId) {
        throw new AppError(400, "Payment order mismatch.");
    }

    if (
        Number(razorpayPayment.amount) !==
        Math.round(Number(payment.amount) * 100)
    ) {
        throw new AppError(400, "Payment amount mismatch.");
    }

    if (razorpayPayment.status !== "captured") {
        throw new AppError(400, "Payment has not been captured.");
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
            where: {
                paymentId: payment.paymentId,
            },
            data: {
                status: "SUCCESS",

                gatewayPaymentId: gatewayPaymentId,
                gatewaySignature: signature,
                gatewayMethod: razorpayPayment.method,

                paidAt: new Date(),
            },
        });

        const updatedBooking = await tx.booking.update({
            where: {
                bookingId: booking.bookingId,
            },
            data: {
                paidAmount: newPaidAmount,
                remainingAmount: newRemainingAmount,

                paymentStatus: isFullyPaid
                    ? "PAID"
                    : "PARTIALLY_PAID",

                status: isFullyPaid
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