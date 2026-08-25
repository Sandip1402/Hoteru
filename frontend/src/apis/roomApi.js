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
        signal,
    });
};