import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useListingService } from "../hooks/useListingService.js";

import { Loading } from "../components/Loading";
import { RoomCard } from "../components/room/RoomCard.jsx";

const FALLBACK_IMAGE = "/images/accommodation-placeholder.jpg";

export const ListingDetails = () => {
    const { listingId } = useParams();

    const { getPublicListingById, getListingRooms } = useListingService();

    const [listing, setListing] = useState(null);
    const [rooms, setRooms] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [roomsLoading, setRoomsLoading] = useState(true);

    const [error, setError] = useState(null);
    const [roomsError, setRoomsError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchListing = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getPublicListingById(listingId, controller.signal);

                setListing(response.data);
            } catch (err) {
                if (err.name === "AbortError") return;

                console.error("Failed to fetch listing:", err);
                setError("Unable to load accommodation.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchListing();

        return () => controller.abort();
    }, [listingId]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchRooms = async () => {
            try {
                setRoomsLoading(true);
                setRoomsError(null);

                const response = await getListingRooms(listingId, controller.signal);

                setRooms(response.data);
            } catch (err) {
                if (err.name === "AbortError") return;

                console.error("Failed to fetch rooms:", err);
                setRoomsError("Unable to load rooms.");
            } finally {
                if (!controller.signal.aborted) {
                    setRoomsLoading(false);
                }
            }
        };

        fetchRooms();

        return () => controller.abort();
    }, [listingId]);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="py-20 text-center">
                <p>{error}</p>
            </div>
        );
    }

    if (!listing) {
        return null;
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">

            {/* Images */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {listing.images?.map((image) => (
                    <img
                        key={image.imageId}
                        src={image.imageUrl || FALLBACK_IMAGE}
                        alt={image.caption || listing.name}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                ))}
            </section>

            {/* Basic information */}
            <section className="mb-8">
                <p className="text-sm text-gray-500">
                    {listing.type}
                </p>

                <h1 className="text-3xl font-bold">
                    {listing.name}
                </h1>

                <p className="mt-2 text-gray-600">
                    {listing.city}, {listing.state}, {listing.country}
                </p>

                {listing.averageRating !== null && (
                    <p className="mt-2">
                        ⭐ {listing.averageRating} ({listing.reviewCount} reviews)
                    </p>
                )}
            </section>

            {/* Description */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                    About this accommodation
                </h2>

                <p className="text-gray-600">
                    {listing.description}
                </p>
            </section>

            {/* Stay information */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">
                    Stay information
                </h2>

                <div className="flex gap-8">
                    <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p>
                            {listing.checkInTime
                                ? new Date(listing.checkInTime).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    }
                                )
                                : "Not specified"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p>
                            {listing.checkOutTime
                                ? new Date(listing.checkOutTime).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    }
                                )
                                : "Not specified"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Amenities */}
            {listing.amenities?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">
                        Amenities
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {listing.amenities.map((amenity) => (
                            <span
                                key={amenity.amenity.amenityId}
                                className="border rounded-full px-3 py-1 text-sm"
                            >
                                {amenity.amenity.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Rooms */}
            <section>
                {roomsLoading && (
                    <p>Loading rooms...</p>
                )}

                {roomsError && (
                    <p className="text-red-500">
                        {roomsError}
                    </p>
                )}

                {!roomsLoading &&
                    !roomsError &&
                    rooms.length === 0 && (
                        <p className="text-gray-500">
                            No rooms are currently available.
                        </p>
                    )}

                {!roomsLoading &&
                    !roomsError &&
                    rooms.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {rooms.map((room) => (
                                <RoomCard
                                    key={room.roomId}
                                    room={room}
                                    link={`/accommodations/${listingId}/rooms/${room.roomId}`}
                                    listingId={listingId}
                                />
                            ))}
                        </div>
                    )}
            </section>
        </main >
    );
}