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

export const cancelBooking = async (
    bookingId,
    cancellationReason,
    accessToken
) => {
    return callAPI(
        `/bookings/${bookingId}/cancel`,
        {
            method: "PATCH",
            body: JSON.stringify({
                cancellationReason,
            }),
        },
        true,
        accessToken
    )
}