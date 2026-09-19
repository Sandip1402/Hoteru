import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";

import { useRoomService } from "../hooks/useRoomService.js";
import { useBookingService } from "../hooks/useBookingService.js";

import { Loading, ImageGallery } from "../components";

const FALLBACK_IMAGE = "/images/altImage.png";

export const RoomDetails = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();

    const { isAuthenticated } = useHoteruAuth();

    const { getRoomById, getRoomImages } = useRoomService();
    const { createBooking } = useBookingService();

    const [room, setRoom] = useState(null);
    const [images, setImages] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [imagesLoading, setImagesLoading] = useState(true);

    const [error, setError] = useState(null);
    const [imagesError, setImagesError] = useState(null);

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("1");
    const [paymentOption, setPaymentOption] = useState("PAY_NOW");

    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState(null);


    // Fetch room
    useEffect(() => {
        const controller = new AbortController();

        const fetchRoom = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getRoomById(
                    roomId,
                    controller.signal
                );

                setRoom(response.data);

                // If the room endpoint still returns amenities,
                // we can use them directly.
            } catch (err) {
                if (err.name === "AbortError") return;

                console.error("Failed to fetch room:", err);
                setError("Unable to load room.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchRoom();

        return () => controller.abort();
    }, [roomId]);


    // Fetch room images
    useEffect(() => {
        const controller = new AbortController();

        const fetchImages = async () => {
            try {
                setImagesLoading(true);
                setImagesError(null);

                const response = await getRoomImages(
                    roomId,
                    controller.signal
                );

                setImages(response.data);
            } catch (err) {
                if (err.name === "AbortError") return;

                console.error("Failed to fetch room images:", err);
                setImagesError("Unable to load room images.");
            } finally {
                if (!controller.signal.aborted) {
                    setImagesLoading(false);
                }
            }
        };

        fetchImages();

        return () => controller.abort();
    }, [roomId]);


    // Create booking
    const handleBooking = async (event) => {
        event.preventDefault();

        if (!isAuthenticated) {
            setBookingError("Please log in to book this room.");
            return;
        }

        if (!checkIn || !checkOut) {
            setBookingError("Please select check-in and check-out dates.");
            return;
        }

        if (checkOut <= checkIn) {
            setBookingError("Check-out must be after check-in.");
            return;
        }

        const guestCount = Number(guests);

        if (
            !guests ||
            !Number.isInteger(guestCount) ||
            guestCount < 1 ||
            guestCount > room.maxGuests
        ) {
            setBookingError(
                `Guests must be between 1 and ${room.maxGuests}.`
            );
            return;
        }

        try {
            setIsBooking(true);
            setBookingError(null);

            const response = await createBooking(
                {
                    roomId: Number(roomId),
                    checkIn,
                    checkOut,
                    guests: guestCount,
                    paymentOption,
                }
            );

            const booking = response.data;

            navigate(`/payments/${booking.bookingId}`, {
                state: {
                    booking,
                },
            });
        } catch (err) {
            console.error("Booking failed:", err);

            setBookingError(
                err.message || "Unable to create booking."
            );
        } finally {
            setIsBooking(false);
        }
    };


    // Loading / error
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

    if (!room) {
        return null;
    }


    // Render
    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="
                    mb-5
                    inline-flex items-center gap-2
                    text-sm font-medium
                    text-text-muted
                    transition hover:text-text
                "
                >
                    <span className="text-lg">←</span>
                    Back
                </button>

                {/* Room heading */}
                <section className="mb-6">
                    <div className="flex flex-col gap-3">
                        <div>
                            <h1 className="text-2xl font-semibold text-text sm:text-3xl">
                                {room.name}
                            </h1>

                            <p className="mt-2 text-sm text-text-muted">
                                {room.roomType}
                            </p>
                        </div>

                        {/* Quick room details */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
                            <span>
                                {room.maxGuests}{" "}
                                {room.maxGuests === 1
                                    ? "guest"
                                    : "guests"}
                            </span>

                            <span>·</span>

                            <span>
                                {room.beds}{" "}
                                {room.beds === 1
                                    ? "bed"
                                    : "beds"}
                            </span>

                            <span>·</span>

                            <span>
                                {room.bedrooms ?? 0}{" "}
                                {(room.bedrooms ?? 0) === 1
                                    ? "bedroom"
                                    : "bedrooms"}
                            </span>

                            <span>·</span>

                            <span>
                                {room.bathrooms}{" "}
                                {room.bathrooms === 1
                                    ? "bathroom"
                                    : "bathrooms"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Gallery */}
                <section className="mb-10">
                    {imagesLoading && (
                        <div className="flex h-[300px] items-center justify-center rounded-2xl border border-border bg-surface sm:h-[480px]">
                            <p className="text-sm text-text-muted">
                                Loading images...
                            </p>
                        </div>
                    )}

                    {imagesError && (
                        <div className="flex h-[300px] items-center justify-center rounded-2xl border border-border bg-surface sm:h-[480px]">
                            <p className="text-sm text-red-500">
                                {imagesError}
                            </p>
                        </div>
                    )}

                    {!imagesLoading && !imagesError && (
                        <ImageGallery
                            images={images}
                            title={room.name}
                        />
                    )}
                </section>

                {/* Main content */}
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">

                    {/* Left content */}
                    <div className="min-w-0">

                        {/* Description */}
                        <section className="border-b border-border pb-8">
                            <h2 className="text-xl font-semibold text-text">
                                About this room
                            </h2>

                            <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-text-muted sm:text-base">
                                {room.description ||
                                    "A comfortable room designed for a relaxing stay."}
                            </p>
                        </section>

                        {/* Room details */}
                        <section className="border-b border-border py-8">
                            <h2 className="text-xl font-semibold text-text">
                                Room details
                            </h2>

                            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div className="rounded-xl border border-border p-4">
                                    <p className="text-xs text-text-light">
                                        Guests
                                    </p>
                                    <p className="mt-1 font-medium text-text">
                                        {room.maxGuests}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border p-4">
                                    <p className="text-xs text-text-light">
                                        Beds
                                    </p>
                                    <p className="mt-1 font-medium text-text">
                                        {room.beds}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border p-4">
                                    <p className="text-xs text-text-light">
                                        Bedrooms
                                    </p>
                                    <p className="mt-1 font-medium text-text">
                                        {room.bedrooms ?? 0}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border p-4">
                                    <p className="text-xs text-text-light">
                                        Bathrooms
                                    </p>
                                    <p className="mt-1 font-medium text-text">
                                        {room.bathrooms}
                                    </p>
                                </div>

                                {room.area && (
                                    <div className="rounded-xl border border-border p-4">
                                        <p className="text-xs text-text-light">
                                            Area
                                        </p>
                                        <p className="mt-1 font-medium text-text">
                                            {room.area}{" "}
                                            {room.areaUnit || ""}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Amenities */}
                        {room.amenities?.length > 0 && (
                            <section className="py-8">
                                <h2 className="text-xl font-semibold text-text">
                                    What this room offers
                                </h2>

                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {room.amenities.map(({ amenity }) => (
                                        <div
                                            key={amenity.amenityId}
                                            className="
                                            flex items-center
                                            rounded-lg
                                            border border-border
                                            px-4 py-3
                                            text-sm text-text
                                        "
                                        >
                                            {amenity.name}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Booking card */}
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">

                            {/* Price */}
                            <div className="flex items-baseline justify-between gap-3">
                                <div>
                                    <span className="text-2xl font-semibold text-text">
                                        ₹{room.basePrice}
                                    </span>

                                    <span className="ml-1 text-sm text-text-muted">
                                        / night
                                    </span>
                                </div>
                            </div>

                            <div className="my-5 border-t border-border" />

                            <form
                                onSubmit={handleBooking}
                                className="space-y-5"
                            >
                                {/* Dates */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="checkIn"
                                            className="mb-2 block text-sm font-medium text-text"
                                        >
                                            Check-in
                                        </label>

                                        <input
                                            id="checkIn"
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) =>
                                                setCheckIn(e.target.value)
                                            }
                                            className="
                                            w-full rounded-lg
                                            border border-border
                                            bg-white px-3 py-2.5
                                            text-sm text-text
                                            outline-none
                                            transition
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/10
                                        "
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="checkOut"
                                            className="mb-2 block text-sm font-medium text-text"
                                        >
                                            Check-out
                                        </label>

                                        <input
                                            id="checkOut"
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) =>
                                                setCheckOut(e.target.value)
                                            }
                                            className="
                                            w-full rounded-lg
                                            border border-border
                                            bg-white px-3 py-2.5
                                            text-sm text-text
                                            outline-none
                                            transition
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/10
                                        "
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Guests */}
                                <div>
                                    <label
                                        htmlFor="guests"
                                        className="mb-2 block text-sm font-medium text-text"
                                    >
                                        Guests
                                    </label>

                                    <input
                                        id="guests"
                                        type="number"
                                        min="1"
                                        max={room.maxGuests}
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                        className="
                                        w-full rounded-lg
                                        border border-border
                                        bg-white px-3 py-2.5
                                        text-sm text-text
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/10
                                    "
                                        required
                                    />
                                </div>

                                {/* Payment option */}
                                <div>
                                    <p className="mb-3 text-sm font-medium text-text">
                                        Payment option
                                    </p>

                                    <div className="space-y-2">
                                        <label
                                            className={`
                                            flex cursor-pointer
                                            items-center gap-3
                                            rounded-lg border
                                            px-4 py-3
                                            text-sm transition
                                            ${paymentOption === "PAY_NOW"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border"
                                                }
                                        `}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentOption"
                                                value="PAY_NOW"
                                                checked={
                                                    paymentOption === "PAY_NOW"
                                                }
                                                onChange={(e) =>
                                                    setPaymentOption(
                                                        e.target.value
                                                    )
                                                }
                                                className="accent-primary"
                                            />

                                            <div>
                                                <p className="font-medium text-text">
                                                    Pay in full
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    Pay the full amount now
                                                </p>
                                            </div>
                                        </label>

                                        <label
                                            className={`
                                            flex cursor-pointer
                                            items-center gap-3
                                            rounded-lg border
                                            px-4 py-3
                                            text-sm transition
                                            ${paymentOption === "BOOK_ONLY"
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border"
                                                }
                                        `}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentOption"
                                                value="BOOK_ONLY"
                                                checked={
                                                    paymentOption ===
                                                    "BOOK_ONLY"
                                                }
                                                onChange={(e) =>
                                                    setPaymentOption(
                                                        e.target.value
                                                    )
                                                }
                                                className="accent-primary"
                                            />

                                            <div>
                                                <p className="font-medium text-text">
                                                    Book only
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    Pay the booking amount
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Error */}
                                {bookingError && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                                        <p className="text-sm text-red-600">
                                            {bookingError}
                                        </p>
                                    </div>
                                )}

                                {/* CTA */}
                                <button
                                    type="submit"
                                    disabled={isBooking}
                                    className="
                                    w-full rounded-lg
                                    bg-primary px-5 py-3
                                    text-sm font-semibold
                                    text-white
                                    transition
                                    hover:bg-primary-dark
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                                >
                                    {isBooking
                                        ? "Creating booking..."
                                        : "Reserve this room"}
                                </button>

                                {!isAuthenticated && (
                                    <p className="text-center text-xs text-text-muted">
                                        Please log in before making a booking.
                                    </p>
                                )}
                            </form>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}