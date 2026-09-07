import { useAPI } from "./useAPI";

export const useListingService = () => {
    const callAPI = useAPI();

    const getListings = async (signal) => {
        return callAPI("/listings", {
            method: "GET",
            signal
        });
    };

    const getPublicListingById = async (listingId, signal) => {
        return callAPI(`/listings/${listingId}`, {
            method: "GET",
            signal
        });
    };

    const getListingImages = async (listingId, signal) => {
        return callAPI(`/listings/${listingId}/images`, {
            method: "GET",
            signal
        });
    };

    const getListingRooms = async (listingId, signal) => {
        return callAPI(`/listings/${listingId}/rooms`, {
            method: "GET",
            signal
        });
    };

    const getHostListings = async (
        signal
    ) => {
        return callAPI(
            "/listings/host",
            { signal },
            true
        );
    };

    const getHostListingById = async (
        listingId,
        signal
    ) => {
        return callAPI(
            `/listings/host/${listingId}`,
            { signal },
            true
        );
    };

    const getAmenities = async (signal) => {
        return callAPI(
            "/amenities",
            {signal},
            true
        );
    };

    const createListing = async (
        listingData
    ) => {
        return callAPI(
            "/listings",
            {
                method: "POST",
                body: JSON.stringify(listingData),
            },
            true
        );
    };

    const updateListing = async (
        listingId,
        listingData
    ) => {
        return callAPI(
            `/listings/${listingId}`,
            {
                method: "PATCH",
                body: JSON.stringify(listingData),
            },
            true,
        );
    };

    const updateListingAmenities = async (
        listingId,
        amenityIds,
    ) => {
        return callAPI(
            `/listings/${listingId}/amenities`,
            {
                method: "PATCH",
                body: JSON.stringify({ amenityIds }),
            },
            true
        );
    };

    const uploadListingImage = async (
        listingId,
        file,
        caption
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
            true
        );
    };

    const makeListingImageThumbnail = async (
        imageId,
    ) => {
        return callAPI(
            `/listings/images/${imageId}/thumbnail`,
            {
                method: "PATCH",
            },
            true
        );
    };

    const deleteListingImage = async (
        listingId,
        imageId,
    ) => {
        return callAPI(
            `/listings/${listingId}/images/${imageId}`,
            {
                method: "DELETE",
            },
            true,
        );
    };

    return {
        getListings,
        getPublicListingById,
        getListingImages,
        getListingRooms,
        getHostListings,
        getHostListingById,
        getAmenities,
        createListing,
        updateListing,
        updateListingAmenities,
        uploadListingImage,
        makeListingImageThumbnail,
        deleteListingImage,
    }

}