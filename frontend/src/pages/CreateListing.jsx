import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useListingService } from "../hooks/useListingService.js";
import { ListingForm } from "../components/listing/ListingForm.jsx";

const EMPTY_FORM = {
    type: "",
    name: "",
    description: "",
    checkInTime: "",
    checkOutTime: "",
    contactPhone: "",
    contactEmail: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    bookingMode: "",
};

export const CreateListing = () => {
    const navigate = useNavigate();

    const { isAuthenticated } = useHoteruAuth();

    const {
        createListing,
        getAmenities,
        updateListingAmenities,
    } = useListingService();

    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [amenitiesLoading, setAmenitiesLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const controller = new AbortController();

        const fetchAmenities = async () => {
            try {
                setAmenitiesLoading(true);

                const response = await getAmenities(
                    controller.signal
                );

                setAmenities(response.data || []);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(
                        "Failed to fetch amenities:",
                        error
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setAmenitiesLoading(false);
                }
            }
        };

        fetchAmenities();

        return () => controller.abort();
    }, [isAuthenticated]);

    const handleSubmit = async (
        form,
        selectedAmenityIds
    ) => {
        setSubmitError(null);
        setLoading(true);

        try {
            const listingData = {
                type: form.type,
                name: form.name,
                description: form.description,

                checkInTime:
                    form.checkInTime || undefined,

                checkOutTime:
                    form.checkOutTime || undefined,

                contactPhone: form.contactPhone,

                contactEmail:
                    form.contactEmail || undefined,

                addressLine1: form.addressLine1,

                addressLine2:
                    form.addressLine2 || undefined,

                landmark:
                    form.landmark || undefined,

                city: form.city,
                state: form.state,
                country: form.country,
                postalCode: form.postalCode,

                latitude:
                    form.latitude === ""
                        ? undefined
                        : Number(form.latitude),

                longitude:
                    form.longitude === ""
                        ? undefined
                        : Number(form.longitude),

                bookingMode: form.bookingMode,
            };

            const response =
                await createListing(listingData);

            const newListingId =
                response.data.listingId;

            await updateListingAmenities(
                newListingId,
                selectedAmenityIds
            );

            navigate(
                `/host/listings/${newListingId}`,
                { replace: true }
            );
        } catch (error) {
            console.error(
                "Failed to create listing:",
                error
            );

            if (error?.errors) {
                throw error;
            }

            setSubmitError(
                error?.message ||
                    "Failed to create listing."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1320px]
                    min-w-0
                    px-4 py-6
                    sm:px-6
                    lg:px-8
                    lg:py-8
                "
            >
                {/* Back */}
                <button
                    type="button"
                    onClick={() =>
                        navigate("/host/listings")
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-text-muted
                        transition
                        hover:text-text
                    "
                >
                    <FaChevronLeft size={10} />
                    Back to listings
                </button>

                {/* Header */}
                <div
                    className="
                        mb-6
                        mt-5
                        sm:mb-8
                    "
                >
                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-text
                            sm:text-3xl
                        "
                    >
                        Create a listing
                    </h1>

                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-sm
                            leading-6
                            text-text-muted
                        "
                    >
                        Add your property details,
                        amenities and booking information
                        to create a new listing.
                    </p>
                </div>

                {/* Form */}
                <section
                    className="
                        min-w-0
                        rounded-2xl
                        border
                        border-border
                        bg-white
                        p-4
                        sm:p-6
                        lg:p-8
                    "
                >
                    {amenitiesLoading ? (
                        <div className="space-y-5">
                            <div className="h-5 w-40 animate-pulse rounded bg-surface" />
                            <div className="h-11 w-full animate-pulse rounded-lg bg-surface" />
                            <div className="h-11 w-full animate-pulse rounded-lg bg-surface" />
                            <div className="h-28 w-full animate-pulse rounded-lg bg-surface" />
                        </div>
                    ) : (
                        <ListingForm
                            initialValues={EMPTY_FORM}
                            initialSelectedAmenities={[]}
                            amenities={amenities}
                            onSubmit={handleSubmit}
                            onCancel={() =>
                                navigate(
                                    "/host/listings"
                                )
                            }
                            loading={loading}
                            submitLabel="Create Listing"
                            submitError={submitError}
                        />
                    )}
                </section>
            </div>
        </main>
    );
};