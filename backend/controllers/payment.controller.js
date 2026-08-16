import { env } from "../config.js";
import * as paymentService from "../services/payment.service.js";
import { asyncHandler } from "../utils/async-handler.js"

export const createPaymentOrder = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const bookingId = Number(req.params.bookingId);

    const payment = await paymentService.createPaymentOrder(
        req.user.id,
        Number(req.params.bookingId),
        req.body.purpose
    );

    res.status(201).json({
        success: true,
        message: "Payment order created successfully.",
        data: {
            ...payment,
            keyId: env.RAZORPAY_KEY_ID,
        },
    });
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const result = await paymentService.verifyPayment({
        userId: req.user.id,
        paymentId: req.body.paymentId,
        orderId: req.body.razorpayOrderId,
        razorpayPaymentId: req.body.razorpayPaymentId,
        signature: req.body.razorpaySignature,
    });

    res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
        data: result,
    });
});