import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
    getHostListings,
} from "../apis/listingApi.js";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";

export const HostListings = () => {
    const {
        isAuthenticated,
        getAccessTokenSilently,
    } = useHoteruAuth();

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

                const token = await getAccessTokenSilently();

                const response =
                    await getHostListings(
                        token,
                        controller.signal
                    );

                setListings(response.data);
            } catch (err) {
                if (
                    err.name === "AbortError"
                ) {
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
                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        };

        fetchListings();

        return () =>
            controller.abort();
    }, [
        isAuthenticated,
        getAccessTokenSilently,
    ]);

    if (loading) {
        return (
            <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">
                Loading your listings...
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Your Listings
                </h1>

                <Link
                    to="/host/listings/create"
                    className="
                        bg-primary
                        text-white
                        rounded-full
                        px-5
                        py-2
                        font-semibold
                    "
                >
                    + Create Listing
                </Link>
            </div>

            {listings.length === 0 ? (
                <div className="text-center py-15">
                    <p className="text-gray-500">
                        You haven't created any listings yet.
                    </p>

                    <Link
                        to="/host/listings/create"
                        className="
                            inline-block
                            mt-4
                            bg-primary
                            text-white
                            rounded-full
                            px-5
                            py-2
                        "
                    >
                        Create your first listing
                    </Link>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {listings.map((listing) => (
                        <Link
                            key={listing.listingId}
                            to={`/host/listings/${listing.listingId}`}
                            state={{ listing }}
                            className="
                                rounded-2xl
                                overflow-hidden
                                shadow
                                hover:shadow-lg
                                transition-shadow
                                bg-base-100
                            "
                        >
                            <img
                                src={
                                    listing.thumbnailUrl ||
                                    "/room1.jpg"
                                }
                                alt={listing.name}
                                className="
                                    w-full
                                    h-50
                                    object-cover
                                "
                            />

                            <div className="p-4">
                                <div className="flex justify-between gap-3">
                                    <h2 className="font-bold">
                                        {listing.name}
                                    </h2>

                                    <span className="text-xs">
                                        {listing.status}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 mt-1">
                                    {listing.type}
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    {listing.city},{" "}
                                    {listing.state}
                                </p>
                            </div>
                        </Link>
                    ))}

                </div>
            )}
        </div>
    );
};