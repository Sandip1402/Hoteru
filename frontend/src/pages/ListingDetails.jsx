import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useListingService } from "../hooks/useListingService.js";

import { Loading, ImageGallery } from "../components";
import { RoomCard } from "../components/room/RoomCard.jsx";

const FALLBACK_IMAGE = "/images/accommodation-placeholder.jpg";

export const ListingDetails = () => {
    const { listingId } = useParams();
    const roomsContainerRef = useRef(null);

    const { getPublicListingById, getListingRooms } = useListingService();

    const [listing, setListing] = useState(null);
    const [rooms, setRooms] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [roomsLoading, setRoomsLoading] = useState(true);

    const [error, setError] = useState(null);
    const [roomsError, setRoomsError] = useState(null);

    const scrollRooms = (direction) => {
        const container = roomsContainerRef.current;

        if (!container) return;

        const amount = Math.max(container.clientWidth * 0.85, 260);

        container.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchListing = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getPublicListingById(
                    listingId,
                    controller.signal
                );

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

                const response = await getListingRooms(
                    listingId,
                    controller.signal
                );

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
            <div className="flex min-h-[500px] items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-text">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-sm text-text-muted">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (!listing) {
        return null;
    }

    const images = listing.images?.length
        ? listing.images
        : [{ imageId: "fallback", imageUrl: FALLBACK_IMAGE }];

    return (
        <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

            {/* Image Gallery */}
            <ImageGallery
                images={images}
                title={listing.name}
            />

            {/* Listing Header */}
            <section className="border-b border-border pb-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                            {listing.type}
                        </p>

                        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl lg:text-4xl">
                            {listing.name}
                        </h1>

                        <p className="mt-2 text-sm text-text-muted sm:text-base">
                            {listing.city}, {listing.state}, {listing.country}
                        </p>
                    </div>

                    {listing.averageRating !== null && (
                        <div className="flex items-center gap-2 sm:pt-2">
                            <span className="text-base">★</span>

                            <span className="text-sm font-semibold text-text">
                                {Number(listing.averageRating).toFixed(1)}
                            </span>

                            <span className="text-sm text-text-muted">
                                ({listing.reviewCount} reviews)
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Main information */}
            <section className="grid gap-10 py-8 lg:grid-cols-[1fr_320px]">

                {/* Left content */}
                <div className="min-w-0">

                    {/* Description */}
                    <div className="mb-10">
                        <h2 className="mb-3 text-lg font-semibold text-text">
                            About this accommodation
                        </h2>

                        <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-text-muted sm:text-base">
                            {listing.description || "No description available."}
                        </p>
                    </div>

                    {/* Stay information */}
                    <div className="mb-10">
                        <h2 className="mb-4 text-lg font-semibold text-text">
                            Stay information
                        </h2>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-border p-4">
                                <p className="text-xs text-text-muted">
                                    Check-in
                                </p>

                                <p className="mt-1 text-sm font-semibold text-text">
                                    {listing.checkInTime
                                        ? new Date(
                                            listing.checkInTime
                                        ).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })
                                        : "Not specified"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border p-4">
                                <p className="text-xs text-text-muted">
                                    Check-out
                                </p>

                                <p className="mt-1 text-sm font-semibold text-text">
                                    {listing.checkOutTime
                                        ? new Date(
                                            listing.checkOutTime
                                        ).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })
                                        : "Not specified"}
                                </p>
                            </div>

                            <div className="col-span-2 rounded-xl border border-border p-4 sm:col-span-1">
                                <p className="text-xs text-text-muted">
                                    Location
                                </p>

                                <p className="mt-1 text-sm font-semibold text-text">
                                    {listing.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    {listing.amenities?.length > 0 && (
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-text">
                                What this place offers
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {listing.amenities.map((item) => (
                                    <span
                                        key={item.amenity.amenityId}
                                        className="rounded-full border border-border bg-white px-4 py-2 text-sm text-text-muted"
                                    >
                                        {item.amenity.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right booking/info card */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 rounded-2xl border border-border bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-text">
                            Ready to find your room?
                        </p>

                        <p className="mt-2 text-sm leading-6 text-text-muted">
                            Choose from the available rooms below and find the
                            right option for your stay.
                        </p>

                        <a
                            href="#rooms"
                            className="mt-5 block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
                        >
                            View rooms
                        </a>
                    </div>
                </aside>
            </section>

            {/* Rooms */}
            <section
                id="rooms"
                className="border-t border-border py-8"
            >
                <div className="mb-5">
                    <h2 className="text-xl font-semibold text-text sm:text-2xl">
                        Available rooms
                    </h2>

                    <p className="mt-1 text-sm text-text-muted">
                        Choose a room that fits your stay.
                    </p>
                </div>

                {roomsLoading && (
                    <div className="py-10 text-center">
                        <p className="text-sm text-text-muted">
                            Loading rooms...
                        </p>
                    </div>
                )}

                {roomsError && (
                    <div className="rounded-xl border border-border px-4 py-8 text-center">
                        <p className="text-sm text-red-500">
                            {roomsError}
                        </p>
                    </div>
                )}

                {!roomsLoading &&
                    !roomsError &&
                    rooms.length === 0 && (
                        <div className="rounded-xl border border-border px-4 py-10 text-center">
                            <p className="text-sm text-text-muted">
                                No rooms are currently available.
                            </p>
                        </div>
                    )}

                {!roomsLoading &&
                    !roomsError &&
                    rooms.length > 0 && (
                        <div className="relative">
                            {/* Left arrow */}
                            <button
                                type="button"
                                onClick={() => scrollRooms("left")}
                                aria-label="Previous rooms"
                                className="
                    absolute left-1 top-1/2 z-20
                    flex h-9 w-9 -translate-y-1/2
                    items-center justify-center
                    rounded-full bg-white
                    text-text shadow-md
                    transition hover:bg-gray-50
                    sm:left-2 sm:h-10 sm:w-10
                "
                            >
                                <FaChevronLeft className="text-xs sm:text-sm" />
                            </button>

                            {/* Room cards viewport */}
                            <div
                                ref={roomsContainerRef}
                                className="
                    overflow-x-hidden
                    scroll-smooth
                "
                            >
                                <div
                                    className="
                        flex gap-4
                        justify-center
                        px-12
                        sm:px-14
                        lg:justify-start
                        lg:px-16
                    "
                                >
                                    {rooms.map((room) => (
                                        <div
                                            key={room.roomId}
                                            className="shrink-0"
                                        >
                                            <RoomCard
                                                room={room}
                                                link={`/accommodations/${listingId}/rooms/${room.roomId}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right arrow */}
                            <button
                                type="button"
                                onClick={() => scrollRooms("right")}
                                aria-label="Next rooms"
                                className="
                                    absolute right-1 top-1/2 z-20
                                    flex h-9 w-9 -translate-y-1/2
                                    items-center justify-center
                                    rounded-full bg-white
                                    text-text shadow-md
                                    transition hover:bg-gray-50
                                    sm:right-2 sm:h-10 sm:w-10
                                "
                            >
                                <FaChevronRight className="text-xs sm:text-sm" />
                            </button>
                        </div>
                    )}
            </section>
        </main>
    );
};