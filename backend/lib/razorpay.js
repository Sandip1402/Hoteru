import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from "../config.js";


const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async ({
    amount,
    receipt,
    currency = "INR",
}) => {
    return razorpay.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency,
        receipt
    });
};

export const fetchPayment = async (paymentId) => {
    return razorpay.payments.fetch(paymentId);
};

export const verifyPaymentSignature = ({
    orderId,
    paymentId,
    signature,
}) => {
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    return expectedSignature === signature;
};

export const createRefund = async ({
    paymentId,
    amount,
}) => {
    return razorpay.payments.refund(paymentId,{
            amount: Math.round(Number(amount) * 100),
        }
    );
};