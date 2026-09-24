import { useAPI } from "./useAPI";

export const useWishlistService = () => {
  const callAPI = useAPI();

  const getMyWishlist = async (signal) => {
    return callAPI(
      "/wishlists",
      {
        method: "GET",
        signal
      },
      true
    );
  };

  const addToWishlist = async (listingId) => {
    return callAPI(
        `/wishlists/${listingId}`,
        {
            method: "POST"
        },
        true
    );
  };

  const removeFromWishlist = async (listingId) => {
    return callAPI(
        `/wishlists/${listingId}`,
        {
            method: "DELETE"
        },
        true
    );
  };

  return {
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
  };
};