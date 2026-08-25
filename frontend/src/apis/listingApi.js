import { callAPI } from "../utils/callAPI";

export const getListings = async (signal) => {
    return callAPI("/listings", {
        method: "GET",
        signal
    });
};

export const getPublicListingById = async (listingId) => {
    return callAPI(`/listings/${listingId}`, {
        method: "GET",
    });
};

export const getListingImages = async (listingId) => {
    return callAPI(`/listings/${listingId}/images`, {
        method: "GET",
    });
};

export const getListingRooms = async (listingId) => {
    return callAPI(`/listings/${listingId}/rooms`, {
        method: "GET",
    });
};