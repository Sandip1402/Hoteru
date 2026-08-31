import { callAPI } from "../utils/callAPI";

export const getRoomById = async (roomId, signal) => {
    return callAPI(`/rooms/${roomId}`, {
        method: "GET",
        signal,
    });
};

export const getRoomImages = async (roomId, signal) => {
    return callAPI(`/rooms/${roomId}/images`, {
        method: "GET",
    });
};

export const uploadRoomImage = async (
    roomId,
    image,
    accessToken
) => {
    const formData = new FormData();

    formData.append("image", image);

    return callAPI(
        `/rooms/${roomId}/images`,
        {
            method: "POST",
            body: formData,
        },
        true,
        accessToken
    );
};

export const deleteRoomImage = async (
    imageId,
    accessToken
) => {
    return callAPI(
        `/rooms/images/${imageId}`,
        {
            method: "DELETE",
        },
        true,
        accessToken
    );
};

export const createRoom = async (listingId, roomData, accessToken) => {
    return callAPI(
        `/rooms/listings/${listingId}`,
        {
            method: "POST",
            body: JSON.stringify(roomData),
        },
        true,
        accessToken
    );
};

export const getRoomsByListing = async (listingId, accessToken) => {
    return callAPI(
        `/listings/${listingId}/rooms`,
        {
            method: "GET",
        },
        true,
        accessToken
    );
};

export const getHostRoomById = async (roomId, accessToken) => {
    return callAPI(
        `/rooms/host/${roomId}`,
        {
            method: "GET",
        },
        true,
        accessToken
    );
};

export const updateRoom = async (roomId, roomData, accessToken) => {
    return callAPI(
        `/rooms/${roomId}`,
        {
            method: "PATCH",
            body: JSON.stringify(roomData),
        },
        true,
        accessToken
    );
};