import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useBookingService } from "../hooks/useBookingService.js";

import { BookingCard } from "../components/booking/BookingCard.jsx";

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
                        onClick={() => navigate("/accommodations")}
                        className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm text-white"
                    >
                        Explore Accommodations
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {bookings.map((booking) => (
                        <BookingCard
                            key={booking.bookingId}
                            booking={booking}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}