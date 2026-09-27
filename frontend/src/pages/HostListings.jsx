import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useListingService } from "../hooks/useListingService.js";

const getStatusClasses = (status) => {
    switch (status) {
        case "APPROVED":
            return "bg-green-50 text-green-700";

        case "PENDING":
            return "bg-yellow-50 text-yellow-700";

        case "REJECTED":
            return "bg-red-50 text-red-700";

        case "DRAFT":
            return "bg-gray-100 text-gray-600";

        default:
            return "bg-gray-100 text-gray-600";
    }
};

export const HostListings = () => {
    const { isAuthenticated } = useHoteruAuth();
    const { getHostListings } = useListingService();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchListings = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!isAuthenticated) {
                    setError(
                        "Please log in to view your listings."
                    );
                    return;
                }

                const response =
                    await getHostListings(controller.signal);

                setListings(response.data || []);
            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                }

                console.error(
                    "Failed to fetch host listings:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load your listings."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchListings();

        return () => controller.abort();
    }, [isAuthenticated]);

    /*
     * Loading
     */
    if (loading) {
        return (
            <section className="min-w-0">
                <div className="mb-6">
                    <div className="h-7 w-40 animate-pulse rounded bg-surface" />
                    <div className="mt-2 h-4 w-64 animate-pulse rounded bg-surface" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-border
                                bg-white
                            "
                        >
                            <div className="h-48 animate-pulse bg-surface" />

                            <div className="space-y-3 p-5">
                                <div className="h-5 w-2/3 animate-pulse rounded bg-surface" />
                                <div className="h-4 w-1/3 animate-pulse rounded bg-surface" />
                                <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    /*
     * Error
     */
    if (error) {
        return (
            <section className="min-w-0">
                <div
                    className="
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-6
                    "
                >
                    <h2 className="text-base font-semibold text-red-700">
                        Unable to load your listings
                    </h2>

                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

            {/* Header */}
            <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-text">
                        My Listings
                    </h1>

                    <p className="mt-1 text-sm text-text-muted">
                        Manage all your accommodation listings.
                    </p>
                </div>

                <Link
                    to="/host/listings/create"
                    className="
                        max-sm:max-w-full
                        max-sm:text-center
                        shrink-0
                        rounded-xl
                        bg-primary
                        px-4 py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:opacity-90
                    "
                >
                    + Create Listing
                </Link>
            </div>

            {/* Empty state */}
            {listings.length === 0 ? (
                <div
                    className="
                        rounded-2xl
                        border
                        border-border
                        bg-white
                        px-5
                        py-12
                        text-center
                        sm:px-8
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-primary/10
                            text-primary
                        "
                    >
                        +
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-text">
                        No listings yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
                        Create your first listing to start
                        hosting guests on Hoteru.
                    </p>

                    <Link
                        to="/host/listings/create"
                        className="
                            mt-5
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            bg-primary
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-primary-dark
                        "
                    >
                        Create your first listing
                    </Link>
                </div>
            ) : (
                <div
                    className="
                        grid
                        gap-5
                        sm:grid-cols-2
                        xl:grid-cols-3
                    "
                >
                    {listings.map((listing) => (
                        <Link
                            key={listing.listingId}
                            to={`/host/listings/${listing.listingId}`}
                            state={{ listing }}
                            className="
                                group
                                min-w-0
                                overflow-hidden
                                rounded-2xl
                                border
                                border-border
                                bg-white
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-md
                            "
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden bg-surface">
                                <img
                                    src={
                                        listing.thumbnailUrl ||
                                        "/images/accommodation-placeholder.jpg"
                                    }
                                    alt={listing.name}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition
                                        duration-300
                                        group-hover:scale-105
                                    "
                                />

                                {/* Status */}
                                <span
                                    className={`
                                        absolute
                                        right-3
                                        top-3
                                        rounded-full
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-semibold
                                        ${getStatusClasses(
                                            listing.status
                                        )}
                                    `}
                                >
                                    {listing.status}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5">

                                <div className="min-w-0">
                                    <h2 className="
                                        truncate
                                        text-base
                                        font-semibold
                                        text-text
                                    ">
                                        {listing.name}
                                    </h2>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-text-muted
                                    ">
                                        {listing.type}
                                    </p>
                                </div>

                                {/* Location */}
                                <div className="
                                    mt-4
                                    flex
                                    items-start
                                    gap-2
                                    text-sm
                                    text-text-muted
                                ">
                                    <span className="mt-0.5">
                                        📍
                                    </span>

                                    <span className="min-w-0 truncate">
                                        {listing.city}
                                        {listing.state
                                            ? `, ${listing.state}`
                                            : ""}
                                    </span>
                                </div>

                                {/* Footer */}
                                <div className="
                                    mt-5
                                    flex
                                    items-center
                                    justify-between
                                    border-t
                                    border-border
                                    pt-4
                                ">
                                    <span className="
                                        text-xs
                                        text-text-muted
                                    ">
                                        View listing
                                    </span>

                                    <span className="
                                        text-sm
                                        font-medium
                                        text-primary
                                    ">
                                        →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};