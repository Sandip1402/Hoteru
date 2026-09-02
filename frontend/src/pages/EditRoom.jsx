import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useRoomService } from "../hooks/useRoomService.js";

import { RoomForm } from "../components/room/RoomForm";

export const EditRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const { getHostRoomById, updateRoom } = useRoomService();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getHostRoomById(Number(roomId));

                setRoom(response.data);
            } catch (error) {
                console.error(
                    "Failed to load room:",
                    error
                );

                setError(
                    error?.message ||
                        "Failed to load room."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            const roomData = {
                name: formData.name.trim(),
                description:
                    formData.description.trim() ||
                    undefined,
                roomType: formData.roomType,
                maxGuests: formData.maxGuests,
                bedrooms:
                    formData.bedrooms === ""
                        ? undefined
                        : formData.bedrooms,
                beds: formData.beds,
                bathrooms: formData.bathrooms,
                basePrice: formData.basePrice,
                quantity: formData.quantity,
                area:
                    formData.area === ""
                        ? undefined
                        : formData.area,
                areaUnit:
                    formData.areaUnit === ""
                        ? undefined
                        : formData.areaUnit,
                isActive: formData.isActive,
            };

            await updateRoom(Number(roomId), roomData);

            navigate(`/host/rooms/${roomId}`);
        } catch (error) {
            console.error(
                "Failed to update room:",
                error
            );

            // Let RoomForm handle validation errors
            throw error;
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading room...</p>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    {error || "Room not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/host/rooms/${roomId}`
                            )
                        }
                        className="text-sm text-gray-500"
                    >
                        ← Back to room
                    </button>

                    <h1 className="mt-3 text-2xl font-semibold">
                        Edit Room
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Update the details of{" "}
                        {room.name}.
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <RoomForm
                        initialValues={{
                            name: room.name,
                            description:
                                room.description || "",
                            roomType: room.roomType,
                            maxGuests:
                                room.maxGuests,
                            bedrooms:
                                room.bedrooms ?? "",
                            beds: room.beds,
                            bathrooms:
                                room.bathrooms,
                            basePrice:
                                room.basePrice,
                            quantity:
                                room.quantity,
                            area: room.area ?? "",
                            areaUnit:
                                room.areaUnit || "",
                            isActive:
                                room.isActive,
                        }}
                        onSubmit={handleSubmit}
                        loading={saving}
                        submitLabel="Update Room"
                    />
                </div>
            </div>
        </div>
    );
}