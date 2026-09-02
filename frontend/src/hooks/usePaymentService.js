import { useAPI } from "./useAPI";

export const usePaymentService = () => {
    const callAPI = useAPI();

    const createPaymentOrder = async (
        bookingId,
        purpose
    ) => {
        return callAPI(
            `/payments/booking/${bookingId}/order`,
            {
                method: "POST",
                body: JSON.stringify({
                    purpose,
                }),
            },
            true
        );
    };
    
    const verifyPayment = async (
        paymentData
    ) => {
        return callAPI(
            "/payments/verify",
            {
                method: "POST",
                body: JSON.stringify(paymentData),
            },
            true
        );
    };

    return {
        createPaymentOrder,
        verifyPayment,
    }
}