import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useRoomService } from "../hooks/useRoomService.js";

const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(price));
};

export const HostRooms = () => {
    const { isAuthenticated } = useHoteruAuth();
    const { getMyRooms } = useRoomService();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchRooms = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!isAuthenticated) {
                    setError("Please log in to view your rooms.");
                    return;
                }

                const response = await getMyRooms(controller.signal);

                setRooms(response.data || []);
            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                }

                console.error("Failed to fetch rooms:", err);

                setError(
                    err.message ||
                    "Unable to load your rooms."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchRooms();

        return () => controller.abort();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-7 w-40 animate-pulse rounded bg-surface" />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="
                                animate-pulse
                                rounded-2xl
                                border
                                border-border
                                bg-white
                                p-5
                            "
                        >
                            <div className="h-5 w-2/3 rounded bg-surface" />
                            <div className="mt-3 h-4 w-1/3 rounded bg-surface" />
                            <div className="mt-6 h-4 w-full rounded bg-surface" />
                            <div className="mt-2 h-4 w-3/4 rounded bg-surface" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-6
            ">
                <h2 className="font-semibold text-red-700">
                    Unable to load rooms
                </h2>

                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="min-w-0">

            {/* Header */}
            <div className="
                mb-6
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">
                <div>
                    <h1 className="
                        text-xl
                        font-semibold
                        text-text
                        sm:text-2xl
                    ">
                        My Rooms
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-text-muted
                    ">
                        Manage all the rooms across your listings.
                    </p>
                </div>

                <Link
                    to="/host/listings"
                    className="
                        w-fit
                        rounded-full
                        bg-primary
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:opacity-90
                    "
                >
                    View Listings
                </Link>
            </div>

            {/* Empty state */}
            {rooms.length === 0 ? (
                <div className="
                    rounded-2xl
                    border
                    border-border
                    bg-white
                    px-6
                    py-14
                    text-center
                ">
                    <h2 className="text-lg font-semibold text-text">
                        No rooms yet
                    </h2>

                    <p className="
                        mx-auto
                        mt-2
                        max-w-md
                        text-sm
                        text-text-muted
                    ">
                        Rooms you create for your listings will
                        appear here.
                    </p>

                    <Link
                        to="/host/listings"
                        className="
                            mt-5
                            inline-flex
                            rounded-full
                            bg-primary
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                        "
                    >
                        Go to Listings
                    </Link>
                </div>
            ) : (

                /* Room grid */
                <div className="
                    grid
                    min-w-0
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                ">
                    {rooms.map((room) => (
                        <Link
                            key={room.roomId}
                            to={`/host/rooms/${room.roomId}`}
                            className="
                                min-w-0
                                rounded-2xl
                                border
                                border-border
                                bg-white
                                p-5
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-md
                            "
                        >
                            {/* Room heading */}
                            <div className="
                                flex
                                items-start
                                justify-between
                                gap-3
                            ">
                                <div className="min-w-0">
                                    <h2 className="
                                        truncate
                                        font-semibold
                                        text-text
                                    ">
                                        {room.name}
                                    </h2>

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-text-muted
                                    ">
                                        {room.roomType}
                                    </p>
                                </div>

                                <span className={`
                                    shrink-0
                                    rounded-full
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-medium
                                    ${
                                        room.isActive
                                            ? "bg-green-50 text-green-600"
                                            : "bg-gray-100 text-gray-500"
                                    }
                                `}>
                                    {room.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </div>

                            {/* Description */}
                            {room.description && (
                                <p className="
                                    mt-4
                                    line-clamp-2
                                    text-sm
                                    text-text-muted
                                ">
                                    {room.description}
                                </p>
                            )}

                            {/* Room details */}
                            <div className="
                                mt-5
                                grid
                                grid-cols-2
                                gap-y-3
                                text-sm
                            ">
                                <div>
                                    <p className="text-xs text-text-muted">
                                        Guests
                                    </p>
                                    <p className="mt-0.5 font-medium text-text">
                                        {room.maxGuests}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-text-muted">
                                        Beds
                                    </p>
                                    <p className="mt-0.5 font-medium text-text">
                                        {room.beds}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-text-muted">
                                        Bedrooms
                                    </p>
                                    <p className="mt-0.5 font-medium text-text">
                                        {room.bedrooms}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-text-muted">
                                        Bathrooms
                                    </p>
                                    <p className="mt-0.5 font-medium text-text">
                                        {room.bathrooms}
                                    </p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="
                                mt-5
                                flex
                                items-end
                                justify-between
                                border-t
                                border-border
                                pt-4
                            ">
                                <div>
                                    <p className="text-xs text-text-muted">
                                        Base price
                                    </p>

                                    <p className="
                                        mt-1
                                        font-semibold
                                        text-text
                                    ">
                                        {formatPrice(room.basePrice)}
                                        <span className="
                                            ml-1
                                            text-xs
                                            font-normal
                                            text-text-muted
                                        ">
                                            / night
                                        </span>
                                    </p>
                                </div>

                                <span className="
                                    text-sm
                                    font-medium
                                    text-primary
                                ">
                                    View →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};