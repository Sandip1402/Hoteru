import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { Loading } from "../components/Loading.jsx";

import { useRoomService } from "../hooks/useRoomService.js";
import { useBookingService } from "../hooks/useBookingService.js";

const FALLBACK_IMAGE = "/images/accommodation-placeholder.jpg";

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
    const [guests, setGuests] = useState(1);
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

        if (guests < 1 || guests > room.maxGuests) {
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
                    guests,
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
        <main className="max-w-7xl mx-auto px-4 py-8">

            {/* Room Images */}
            <section className="mb-8">
                <h1 className="text-3xl font-bold mb-4">
                    {room.name}
                </h1>

                {imagesLoading && (
                    <div className="h-72 flex items-center justify-center border rounded-lg">
                        Loading images...
                    </div>
                )}

                {imagesError && (
                    <div className="h-72 flex items-center justify-center border rounded-lg">
                        <p>{imagesError}</p>
                    </div>
                )}

                {!imagesLoading && !imagesError && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {images.length > 0 ? (
                            images.map((image) => (
                                <img
                                    key={image.imageId}
                                    src={
                                        image.imageUrl ||
                                        FALLBACK_IMAGE
                                    }
                                    alt={
                                        image.altText ||
                                        room.name
                                    }
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            ))
                        ) : (
                            <img
                                src={FALLBACK_IMAGE}
                                alt={room.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        )}
                    </div>
                )}
            </section>

            {/* Room information */}
            <section className="mb-8">
                <p className="text-sm text-gray-500">
                    {room.roomType}
                </p>

                <div className="flex flex-wrap gap-4 mt-3">
                    <span>
                        {room.maxGuests} guests
                    </span>

                    <span>
                        {room.beds} beds
                    </span>

                    <span>
                        {room.bedrooms ?? 0} bedrooms
                    </span>

                    <span>
                        {room.bathrooms} bathrooms
                    </span>
                </div>

                <p className="mt-4 text-gray-600">
                    {room.description}
                </p>
            </section>

            {/* Amenities */}
            {room.amenities?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">
                        Amenities
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {room.amenities.map(({ amenity }) => (
                            <span
                                key={amenity.amenityId}
                                className="border rounded-full px-3 py-1 text-sm"
                            >
                                {amenity.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Booking */}
            <section className="max-w-xl border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Book this room
                </h2>

                <p className="mb-4">
                    ₹{room.basePrice} / night
                </p>

                <form
                    onSubmit={handleBooking}
                    className="space-y-4"
                >
                    {/* Check-in */}
                    <div>
                        <label
                            htmlFor="checkIn"
                            className="block mb-1"
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
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                    </div>

                    {/* Check-out */}
                    <div>
                        <label
                            htmlFor="checkOut"
                            className="block mb-1"
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
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                    </div>

                    {/* Guests */}
                    <div>
                        <label
                            htmlFor="guests"
                            className="block mb-1"
                        >
                            Guests
                        </label>

                        <input
                            id="guests"
                            type="number"
                            min="1"
                            max={room.maxGuests}
                            value={guests}
                            onChange={(e) =>
                                setGuests(Number(e.target.value))
                            }
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                    </div>

                    {/* Payment option */}
                    <div>
                        <p className="mb-2">
                            Payment option
                        </p>

                        <label className="flex gap-2 items-center">
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
                            />

                            Full payment
                        </label>

                        <label className="flex gap-2 items-center mt-2">
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
                            />

                            Book only
                        </label>
                    </div>

                    {bookingError && (
                        <p className="text-red-500">
                            {bookingError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isBooking}
                        className="bg-primary text-white rounded-full px-5 py-2 font-semibold disabled:opacity-50"
                    >
                        {isBooking
                            ? "Creating booking..."
                            : "Book this room"}
                    </button>
                </form>
            </section>
        </main>
    );
}