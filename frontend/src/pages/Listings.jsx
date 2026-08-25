import { useEffect, useState } from "react";
import { ListingCard } from "../components/listing/ListingCard";
import { getListings } from "../apis/listingApi.js";
import { Loading } from "../components/Loading";
import { Controller } from "react-hook-form";

export const Listings = () => {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchListings = async () => {
            try {
                setError(null);

                const response = await getListings(controller.signal);

                setListings(response.data);
            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                }

                console.error("Failed to fetch listings:", err);
                setError("Unable to load accommodations.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchListings();

        return () => controller.abort();
        
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Accommodations
                </h1>

                <p className="mt-2 text-gray-500">
                    Find a place that fits your stay.
                </p>
            </div>

            {listings.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center">
                    <p className="text-gray-500">
                        No accommodations available.
                    </p>
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {listings.map((listing) => (
                        <ListingCard
                            key={listing.listingId}
                            listing={listing}
                        />
                    ))}
                </section>
            )}
        </main>
    );
};