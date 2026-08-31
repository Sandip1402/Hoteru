import { callAPI } from "../utils/callAPI";

export const createListing = async (
    listingData,
    accessToken
) => {
    return callAPI(
        "/listings",
        {
            method: "POST",
            body: JSON.stringify(listingData),
        },
        true,
        accessToken
    );
};

export const getListings = async (signal) => {
    return callAPI("/listings", {
        method: "GET",
        signal
    });
};

export const updateListing = async (
    listingId,
    listingData,
    accessToken
) => {
    return callAPI(
        `/listings/${listingId}`,
        {
            method: "PATCH",
            body: JSON.stringify(listingData),
        },
        true,
        accessToken
    );
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

export const getHostListings = async (
    accessToken,
    signal
) => {
    return callAPI(
        "/listings/host",
        {
            signal,
        },
        true,
        accessToken
    );
};

export const getHostListingById = async (
    listingId,
    accessToken,
    signal
) => {
    return callAPI(
        `/listings/host/${listingId}`,
        {
            signal,
        },
        true,
        accessToken
    );
};

export const uploadListingImage = async (
    listingId,
    file,
    caption,
    accessToken
) => {
    const formData = new FormData();

    formData.append("image", file);

    if (caption) {
        formData.append("caption", caption);
    }

    return callAPI(
        `/listings/${listingId}/images`,
        {
            method: "POST",
            body: formData,
        },
        true,
        accessToken
    );
};

export const deleteListingImage = async (
    listingId,
    imageId,
    accessToken
) => {
    return callAPI(
        `/listings/${listingId}/images/${imageId}`,
        {
            method: "DELETE",
        },
        true,
        accessToken
    );
};

export const makeListingImageThumbnail = async (
    imageId,
    accessToken
) => {
    return callAPI(
        `/listings/images/${imageId}/thumbnail`,
        {
            method: "PATCH",
        },
        true,
        accessToken
    );
};

export const getAmenities = async (accessToken, signal) => {
    return callAPI(
        "/amenities",
        { signal },
        true,
        accessToken
    );
};

export const updateListingAmenities = async (
    listingId,
    amenityIds,
    accessToken
) => {
    return callAPI(
        `/listings/${listingId}/amenities`,
        {
            method: "PATCH",
            body: JSON.stringify({ amenityIds }),
        },
        true,
        accessToken
    );
};