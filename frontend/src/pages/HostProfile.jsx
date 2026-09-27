import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useListingService } from "../hooks/useListingService.js";
import { useRoomService } from "../hooks/useRoomService.js";

const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(price));
};

const getStatusClasses = (status) => {
    switch (status) {
        case "APPROVED":
            return "bg-green-50 text-green-600";

        case "PENDING":
            return "bg-yellow-50 text-yellow-600";

        case "REJECTED":
            return "bg-red-50 text-red-600";

        case "DRAFT":
            return "bg-gray-100 text-gray-600";

        default:
            return "bg-gray-100 text-gray-600";
    }
};

export const HostProfile = () => {
    const {
        currentUser,
        isAuthenticated,
    } = useHoteruAuth();

    const { getHostListings } = useListingService();
    const { getMyRooms } = useRoomService();

    const [listings, setListings] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [listingsResponse, roomsResponse] =
                    await Promise.all([
                        getHostListings(controller.signal),
                        getMyRooms(controller.signal),
                    ]);

                if (controller.signal.aborted) {
                    return;
                }

                setListings(listingsResponse.data || []);
                setRooms(roomsResponse.data || []);
            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                }

                console.error(
                    "Failed to load host dashboard:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load your dashboard."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => controller.abort();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="space-y-6">

                <div className="
                    h-28
                    animate-pulse
                    rounded-2xl
                    bg-surface
                " />

                <div className="
                    grid
                    gap-4
                    sm:grid-cols-2
                ">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="
                                h-48
                                animate-pulse
                                rounded-2xl
                                bg-surface
                            "
                        />
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
                <h2 className="
                    font-semibold
                    text-red-700
                ">
                    Unable to load dashboard
                </h2>

                <p className="
                    mt-1
                    text-sm
                    text-red-600
                ">
                    {error}
                </p>
            </div>
        );
    }

    const recentListings = listings.slice(0, 3);
    const recentRooms = rooms.slice(0, 3);

    return (
        <div className="min-w-0 space-y-8">

            {/* Welcome */}
            <section className="
                rounded-2xl
                border
                border-border
                bg-white
                p-5
                sm:p-6
            ">
                <p className="
                    text-sm
                    text-text-muted
                ">
                    Host Dashboard
                </p>

                <h1 className="
                    mt-1
                    text-2xl
                    font-semibold
                    text-text
                ">
                    Welcome back
                    {currentUser?.firstname
                        ? `, ${currentUser.firstname}`
                        : ""}
                </h1>

                <p className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-text-muted
                ">
                    Manage your listings, rooms and hosting
                    activity from here.
                </p>
            </section>

            {/* Quick stats */}
            <section className="
                grid
                gap-4
                sm:grid-cols-2
            ">
                <div className="
                    rounded-2xl
                    border
                    border-border
                    bg-white
                    p-5
                ">
                    <p className="
                        text-sm
                        text-text-muted
                    ">
                        Total Listings
                    </p>

                    <p className="
                        mt-2
                        text-2xl
                        font-semibold
                        text-text
                    ">
                        {listings.length}
                    </p>
                </div>

                <div className="
                    rounded-2xl
                    border
                    border-border
                    bg-white
                    p-5
                ">
                    <p className="
                        text-sm
                        text-text-muted
                    ">
                        Total Rooms
                    </p>

                    <p className="
                        mt-2
                        text-2xl
                        font-semibold
                        text-text
                    ">
                        {rooms.length}
                    </p>
                </div>
            </section>

            {/* Recent Listings */}
            <section>

                <div className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    gap-3
                ">
                    <div>
                        <h2 className="
                            text-lg
                            font-semibold
                            text-text
                        ">
                            Recent Listings
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-text-muted
                        ">
                            Your recently created accommodations.
                        </p>
                    </div>

                    <Link
                        to="/host/listings"
                        className="
                            shrink-0
                            text-sm
                            font-medium
                            text-primary
                            hover:underline
                        "
                    >
                        View all
                    </Link>
                </div>

                {recentListings.length === 0 ? (
                    <div className="
                        rounded-2xl
                        border
                        border-border
                        bg-white
                        p-6
                        text-center
                    ">
                        <p className="
                            text-sm
                            text-text-muted
                        ">
                            You haven't created any listings yet.
                        </p>

                        <Link
                            to="/host/listings/create"
                            className="
                                mt-4
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
                            Create Listing
                        </Link>
                    </div>
                ) : (
                    <div className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-3
                    ">
                        {recentListings.map((listing) => (
                            <Link
                                key={listing.listingId}
                                to={`/host/listings/${listing.listingId}`}
                                state={{ listing }}
                                className="
                                    min-w-0
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-border
                                    bg-white
                                    transition
                                    hover:shadow-md
                                "
                            >
                                <img
                                    src={
                                        listing.thumbnailUrl ||
                                        "/room1.jpg"
                                    }
                                    alt={listing.name}
                                    className="
                                        h-40
                                        w-full
                                        object-cover
                                    "
                                />

                                <div className="p-4">

                                    <div className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-3
                                    ">
                                        <h3 className="
                                            min-w-0
                                            truncate
                                            font-semibold
                                            text-text
                                        ">
                                            {listing.name}
                                        </h3>

                                        <span className={`
                                            shrink-0
                                            rounded-full
                                            px-2
                                            py-1
                                            text-[11px]
                                            font-medium
                                            ${getStatusClasses(
                                                listing.status
                                            )}
                                        `}>
                                            {listing.status}
                                        </span>
                                    </div>

                                    <p className="
                                        mt-2
                                        text-sm
                                        text-text-muted
                                    ">
                                        {listing.type}
                                    </p>

                                    <p className="
                                        mt-1
                                        truncate
                                        text-sm
                                        text-text-muted
                                    ">
                                        {listing.city},{" "}
                                        {listing.state}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Recent Rooms */}
            <section>

                <div className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    gap-3
                ">
                    <div>
                        <h2 className="
                            text-lg
                            font-semibold
                            text-text
                        ">
                            Recent Rooms
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-text-muted
                        ">
                            Rooms you've recently added.
                        </p>
                    </div>

                    <Link
                        to="/host/rooms"
                        className="
                            shrink-0
                            text-sm
                            font-medium
                            text-primary
                            hover:underline
                        "
                    >
                        View all
                    </Link>
                </div>

                {recentRooms.length === 0 ? (
                    <div className="
                        rounded-2xl
                        border
                        border-border
                        bg-white
                        p-6
                        text-center
                    ">
                        <p className="
                            text-sm
                            text-text-muted
                        ">
                            You haven't created any rooms yet.
                        </p>

                        <Link
                            to="/host/listings"
                            className="
                                mt-4
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
                            View Listings
                        </Link>
                    </div>
                ) : (
                    <div className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-3
                    ">
                        {recentRooms.map((room) => (
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
                                    hover:shadow-md
                                "
                            >
                                <div className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-3
                                ">
                                    <div className="min-w-0">
                                        <h3 className="
                                            truncate
                                            font-semibold
                                            text-text
                                        ">
                                            {room.name}
                                        </h3>

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
                                        px-2
                                        py-1
                                        text-[11px]
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

                                <div className="
                                    mt-5
                                    grid
                                    grid-cols-2
                                    gap-y-3
                                ">
                                    <div>
                                        <p className="
                                            text-xs
                                            text-text-muted
                                        ">
                                            Guests
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            font-medium
                                            text-text
                                        ">
                                            {room.maxGuests}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="
                                            text-xs
                                            text-text-muted
                                        ">
                                            Beds
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            font-medium
                                            text-text
                                        ">
                                            {room.beds}
                                        </p>
                                    </div>
                                </div>

                                <div className="
                                    mt-5
                                    border-t
                                    border-border
                                    pt-4
                                ">
                                    <p className="
                                        text-xs
                                        text-text-muted
                                    ">
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
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};