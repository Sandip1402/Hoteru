import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useBookingService } from "../hooks/useBookingService.js";

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(price));
};

const getStatusClasses = (status) => {
    switch (status) {
        case "CONFIRMED":
            return "bg-green-100 text-green-700";

        case "AWAITING_PAYMENT":
            return "bg-yellow-100 text-yellow-700";

        case "CANCELLED":
            return "bg-red-100 text-red-700";

        case "COMPLETED":
            return "bg-blue-100 text-blue-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};

const getPaymentStatusClasses = (status) => {
    switch (status) {
        case "PAID":
            return "text-green-600";

        case "PENDING":
            return "text-yellow-600";

        case "REFUNDED":
            return "text-blue-600";

        case "FAILED":
        case "CANCELLED":
            return "text-red-600";

        default:
            return "text-gray-500";
    }
};

export const Bookings = () => {
    const navigate = useNavigate();

    const { isAuthenticated } = useHoteruAuth();
    const { getMyBookings } = useBookingService();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getMyBookings(
                    controller.signal
                );

                setBookings(response.data || []);
            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                }

                console.error(
                    "Failed to fetch bookings:",
                    err
                );

                setError(
                    err.message ||
                        "Failed to load bookings."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();

        return () => controller.abort();
    }, [
        isAuthenticated
    ]);

    if (!isAuthenticated) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-12">
                <div className="rounded-xl border bg-white p-8 text-center">
                    <h1 className="text-xl font-semibold">
                        Log in to view your bookings
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Your bookings will appear here after
                        you log in.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8">
                <h1 className="mb-6 text-2xl font-bold">
                    My Bookings
                </h1>

                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse overflow-hidden rounded-xl border bg-white"
                        >
                            <div className="flex flex-col sm:flex-row">
                                <div className="h-48 bg-gray-200 sm:h-auto sm:w-56" />

                                <div className="flex-1 space-y-4 p-5">
                                    <div className="h-5 w-2/3 rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-12">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                    <h1 className="text-lg font-semibold text-red-700">
                        Unable to load bookings
                    </h1>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                        className="mt-4 rounded-lg bg-black px-5 py-2.5 text-sm text-white"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    My Bookings
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    View and manage your bookings.
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="rounded-xl border bg-white p-10 text-center">
                    <h2 className="text-lg font-semibold">
                        No bookings yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Your bookings will appear here once
                        you make a reservation.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/accommodations")
                        }
                        className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm text-white"
                    >
                        Explore Accommodations
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <article
                            key={booking.bookingId}
                            className="overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md"
                        >
                            <div className="flex flex-col sm:flex-row">

                                {/* Thumbnail */}
                                <div className="h-48 shrink-0 sm:h-auto sm:w-56">
                                    {booking.thumbnailUrl ? (
                                        <img
                                            src={
                                                booking.thumbnailUrl
                                            }
                                            alt={
                                                booking.listingName
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full min-h-48 items-center justify-center bg-gray-100 text-sm text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex min-w-0 flex-1 flex-col p-5">

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <h2 className="truncate text-lg font-semibold">
                                                {booking.listingName}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {booking.roomName}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status
                                                .replaceAll(
                                                    "_",
                                                    " "
                                                )}
                                        </span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">

                                        <div>
                                            <p className="text-gray-500">
                                                Check-in
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {formatDate(
                                                    booking.checkIn
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Check-out
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {formatDate(
                                                    booking.checkOut
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Guests
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {booking.guests}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Booking reference
                                            </p>

                                            <p className="mt-1 text-sm font-medium">
                                                {
                                                    booking.bookingReference
                                                }
                                            </p>

                                            {booking.paymentStatus && (
                                                <p className="mt-1 text-xs">
                                                    Payment:{" "}
                                                    <span
                                                        className={`font-medium ${getPaymentStatusClasses(
                                                            booking.paymentStatus
                                                        )}`}
                                                    >
                                                        {
                                                            booking.paymentStatus
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">
                                                    Total
                                                </p>

                                                <p className="text-lg font-semibold">
                                                    {formatPrice(
                                                        booking.totalPrice
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/bookings/${booking.bookingId}`
                                                    )
                                                }
                                                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}