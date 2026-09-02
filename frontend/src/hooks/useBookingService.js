import { useAPI } from "./useAPI";

export const useBookingService = () => {
  const callAPI = useAPI();

  const getBookingById = async (bookingId, signal) => {
    return callAPI(
      `/bookings/${bookingId}`,
      { signal },
      true
    );
  };

  const createBooking = async (bookingData) => {
    return callAPI(
      "/bookings",
      {
        method: "POST",
        body: JSON.stringify(bookingData),
      },
      true
    );
  };

  const cancelBooking = async (bookingId, cancellationReason) => {
    return callAPI(
      `/bookings/${bookingId}/cancel`,
      {
        method: "PATCH",
        body: JSON.stringify({ cancellationReason }),
      },
      true
    );
  };

  return {
    getBookingById,
    createBooking,
    cancelBooking,
  };
};
