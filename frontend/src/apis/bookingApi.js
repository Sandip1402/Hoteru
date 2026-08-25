import { callAPI } from "../utils/callAPI";

export const createBooking = async (bookingData, accessToken) => {
    return callAPI(
        "/bookings",
        {
            method: "POST",
            body: JSON.stringify(bookingData),
        },
        true,
        accessToken
    );
};

export const getBookingById = async (
    bookingId,
    accessToken,
    signal
) => {
    return callAPI(
        `/bookings/${bookingId}`,
        { signal },
        true,
        accessToken
    );
};