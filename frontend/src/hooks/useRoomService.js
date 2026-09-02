import { useAPI } from "./useAPI";

export const useRoomService = () => {
    const callAPI = useAPI();

    const getRoomById = async (roomId, signal) => {
        return callAPI(`/rooms/${roomId}`, {
            method: "GET",
            signal,
        });
    };

    const getRoomImages = async (roomId, signal) => {
        return callAPI(`/rooms/${roomId}/images`, {
            method: "GET",
        });
    };

    const getRoomsByListing = async (listingId) => {
        return callAPI(
            `/listings/${listingId}/rooms`,
            {
                method: "GET",
            },
            true
        );
    };

    const getHostRoomById = async (roomId) => {
        return callAPI(
            `/rooms/host/${roomId}`,
            {
                method: "GET",
            },
            true
        );
    };

    const createRoom = async (listingId, roomData) => {
        return callAPI(
            `/rooms/listings/${listingId}`,
            {
                method: "POST",
                body: JSON.stringify(roomData),
            },
            true
        );
    };

    const updateRoom = async (roomId, roomData) => {
        return callAPI(
            `/rooms/${roomId}`,
            {
                method: "PATCH",
                body: JSON.stringify(roomData),
            },
            true
        );
    };

    const uploadRoomImage = async (
        roomId,
        image
    ) => {
        const formData = new FormData();

        formData.append("image", image);

        return callAPI(
            `/rooms/${roomId}/images`,
            {
                method: "POST",
                body: formData,
            },
            true
        );
    };

    const deleteRoomImage = async (
        imageId
    ) => {
        return callAPI(
            `/rooms/images/${imageId}`,
            {
                method: "DELETE",
            },
            true
        );
    };

    return {
        getRoomById,
        getRoomImages,
        getRoomsByListing,
        getHostRoomById,
        createRoom,
        updateRoom,
        uploadRoomImage,
        deleteRoomImage,
    }
}