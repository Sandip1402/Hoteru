import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { useListingService } from "../hooks/useListingService.js";

import { ListingCard } from "../components/listing/ListingCard";
import { ListingFilters } from "../components/listing/ListingFilters";
import { Loading, Search } from "../components";

export const Listings = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const { getListings } = useListingService();

    const [type, setType] = useState("");
    const [price, setPrice] = useState(10000);
    const [amenities, setAmenities] = useState([]);
    const [rating, setRating] = useState("");

    const city = searchParams.get("city") || "";
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const guests = searchParams.get("guests") || "";

    const [listings, setListings] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const queryparams = { city, checkIn, checkOut, guests };

        const fetchListings = async () => {
            try {
                setError(null);

                const response = await getListings(controller.signal, queryparams);

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

    }, [city, checkIn, checkOut, guests]);

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
        <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

            {/* Search */}
            <div className="mb-8">
                <Search />
            </div>

            {/* Heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                    {city ? `Places to stay in ${city}` : "Accommodations"}
                </h1>

                <p className="mt-1 text-sm text-text-muted">
                    Find a place that fits your stay.
                </p>
            </div>

            {/* Content */}
            <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                {/* Desktop filters */}
                <div className="hidden lg:block">
                    <ListingFilters
                        type={type}
                        setType={setType}
                        price={price}
                        setPrice={setPrice}
                        amenities={amenities}
                        setAmenities={setAmenities}
                        rating={rating}
                        setRating={setRating}
                    />
                </div>

                {/* Listings */}
                <div className="min-w-0">
                    {/* Mobile filter button */}
                    <div className="mb-5 flex items-center justify-between lg:hidden">
                        <p className="text-sm text-text-muted">
                            {listings.length} {listings.length === 1 ? "place" : "places"}
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowFilters(true)}
                            className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text transition hover:bg-gray-50"
                        >
                            <img
                                src="/Icons/filter.svg"
                                alt=""
                                className="h-4 w-4"
                            />
                            Filters
                        </button>
                    </div>

                    {listings.length === 0 ? (
                        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border">
                            <div className="text-center">
                                <h2 className="font-semibold text-text">
                                    No accommodations found
                                </h2>

                                <p className="mt-1 text-sm text-text-muted">
                                    Try changing your search or filters.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <section className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                            {listings.map((listing) => (
                                <ListingCard
                                    key={listing.listingId}
                                    listing={listing}
                                />
                            ))}
                        </section>
                    )}
                </div>
            </div>
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setShowFilters(false)}
                        className="absolute inset-0 bg-black/30"
                    />

                    {/* Drawer */}
                    <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-5 py-4">
                            <div>
                                <h2 className="text-base font-semibold text-text">
                                    Filters
                                </h2>

                                <p className="mt-0.5 text-xs text-text-muted">
                                    Refine your search
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowFilters(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-text-muted transition hover:bg-gray-100 hover:text-text"
                                aria-label="Close filters"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-4">
                            <ListingFilters
                                type={type}
                                setType={setType}
                                price={price}
                                setPrice={setPrice}
                                amenities={amenities}
                                setAmenities={setAmenities}
                                rating={rating}
                                setRating={setRating}
                            />
                        </div>

                        <div className="sticky bottom-0 border-t border-border bg-white p-4">
                            <button
                                type="button"
                                onClick={() => setShowFilters(false)}
                                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                            >
                                Show {listings.length} places
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};