
import { useNavigate, useParams } from "react-router";
import { useState } from "react";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { createRoom } from "../apis/roomApi.js";
import { RoomForm } from "../components/room/RoomForm.jsx";

const initialForm = {
    name: "",
    description: "",
    roomType: "",
    maxGuests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    basePrice: "",
    quantity: 1,
    area: "",
    areaUnit: "",
    isActive: true,
};

export const AddRoom = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();

    const { getAccessTokenSilently } =
        useHoteruAuth();

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] =
        useState("");

    const handleSubmit = async (formData) => {
        setServerError("");
        setLoading(true);

        try {
            const accessToken =
                await getAccessTokenSilently();

            const roomData = {
                name: formData.name.trim(),

                description:
                    formData.description.trim() ||
                    undefined,

                roomType: formData.roomType,

                maxGuests: formData.maxGuests,

                bedrooms:
                    formData.bedrooms || undefined,

                beds: formData.beds,

                bathrooms: formData.bathrooms,

                basePrice: formData.basePrice,

                quantity: formData.quantity,

                area:
                    formData.area || undefined,

                areaUnit:
                    formData.areaUnit || undefined,

                isActive: formData.isActive,
            };

            await createRoom(
                Number(listingId),
                roomData,
                accessToken
            );

            navigate(
                `/host/listings/${listingId}`
            );
        } catch (error) {
            console.error(
                "Create room error:",
                error
            );

            /*
             * RoomForm handles validation errors.
             * We only handle errors that are not
             * field-level validation errors here.
             */
            if (!error?.errors) {
                setServerError(
                    error?.message ||
                    "Failed to create room."
                );
            }

            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Add Room
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Add a room to your accommodation.
                    </p>
                </div>

                {serverError && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {serverError}
                    </div>
                )}

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <RoomForm
                        initialValues={initialForm}
                        onSubmit={handleSubmit}
                        onCancel={() =>
                            navigate(`/host/listings/${listingId}`)
                        }
                        loading={loading}
                        submitLabel="Create Room"
                    />
                </div>
            </div>
        </div>
    );
};
