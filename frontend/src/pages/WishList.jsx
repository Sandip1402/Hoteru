import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useWishlistService } from "../hooks/useWishlistService.js";

const formatLocation = (listing) => {
    return [listing.city, listing.state, listing.country]
        .filter(Boolean)
        .join(", ");
};

export const WishList = () => {
    const navigate = useNavigate();

    const { isAuthenticated } = useHoteruAuth();
    const {
        getMyWishlist,
        removeFromWishlist,
    } = useWishlistService();
    
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchWishlist = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getMyWishlist(
                    controller.signal
                );

                setWishlist(response.data || []);
            } catch (err) {
                if (err.name === "AbortError") return;

                console.error(
                    "Failed to fetch wishlist:",
                    err
                );

                setError(
                    err.message ||
                        "Failed to load your wishlist."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();

        return () => controller.abort();
    }, [isAuthenticated]);

    const handleRemove = async (listingId) => {
        try {
            await removeFromWishlist(listingId);

            setWishlist((current) =>
                current.filter(
                    (item) =>
                        item.listing.listingId !== listingId
                )
            );
        } catch (err) {
            console.error(
                "Failed to remove from wishlist:",
                err
            );
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="py-12 text-center">
                <h1 className="text-xl font-semibold text-text">
                    Log in to view your wishlist
                </h1>

                <p className="mt-2 text-sm text-text-muted">
                    Save your favorite accommodations here.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-200" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="overflow-hidden rounded-xl border border-border bg-white"
                        >
                            <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                            <div className="space-y-3 p-4">
                                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <h1 className="font-semibold text-red-700">
                    Unable to load wishlist
                </h1>

                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-text">
                    Wishlist
                </h1>

                <p className="mt-1 text-sm text-text-muted">
                    Your saved accommodations.
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div className="rounded-xl border border-border bg-white px-6 py-12 text-center">
                    <h2 className="text-lg font-semibold text-text">
                        Your wishlist is empty
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
                        Save accommodations you like while
                        exploring Hoteru and find them here
                        later.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/accommodations")
                        }
                        className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark"
                    >
                        Explore Accommodations
                    </button>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((item) => {
                        const listing = item.listing;

                        return (
                            <article
                                key={listing.listingId}
                                className="group overflow-hidden rounded-xl border border-border bg-white"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemove(
                                                listing.listingId
                                            )
                                        }
                                        aria-label="Remove from wishlist"
                                        className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:bg-white"
                                    >
                                        ♥
                                    </button>

                                    {listing.thumbnailUrl ? (
                                        <img
                                            src={
                                                listing.thumbnailUrl
                                            }
                                            alt={listing.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-surface text-sm text-text-light">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/accommodations/${listing.listingId}`
                                        )
                                    }
                                    className="block w-full text-left"
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <h2 className="truncate font-semibold text-text">
                                                {listing.name}
                                            </h2>

                                            {listing.averageRating && (
                                                <span className="shrink-0 text-sm text-text">
                                                    ★{" "}
                                                    {Number(
                                                        listing.averageRating
                                                    ).toFixed(1)}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-text-muted">
                                            {formatLocation(listing)}
                                        </p>

                                        <p className="mt-2 text-xs text-text-light">
                                            {listing.type}
                                            {listing.reviewCount
                                                ? ` · ${listing.reviewCount} reviews`
                                                : ""}
                                        </p>
                                    </div>
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};