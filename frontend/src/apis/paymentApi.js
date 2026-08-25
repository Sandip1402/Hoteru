import { callAPI } from "../utils/callAPI";

export const createPaymentOrder = async (
    bookingId,
    purpose,
    accessToken
) => {
    return callAPI(
        `/payments/booking/${bookingId}/order`,
        {
            method: "POST",
            body: JSON.stringify({
                purpose,
            }),
        },
        true,
        accessToken
    );
};

export const verifyPayment = async (
    paymentData,
    accessToken
) => {
    return callAPI(
        "/payments/verify",
        {
            method: "POST",
            body: JSON.stringify(paymentData),
        },
        true,
        accessToken
    );
};