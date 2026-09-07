import { useEffect, useState } from "react";
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

                const response = await getAmenities(controller.signal);

                setAmenities(response.data || []);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(
                        "Failed to fetch amenities:",
                        error
                    );
                }
            } finally {
                setAmenitiesLoading(false);
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

            const response = await createListing(listingData);

            const newListingId = response.data.listingId;

            await updateListingAmenities(newListingId, selectedAmenityIds);

            navigate(
                `/host/listings/${newListingId}`,
                {
                    replace: true,
                }
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

    if (!isAuthenticated) {
        return (
            <div className="p-6">
                <p>Log in to continue.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    Create Listing
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Add your property details to create a
                    listing.
                </p>
            </div>

            {amenitiesLoading ? (
                <p className="text-sm text-gray-500">
                    Loading amenities...
                </p>
            ) : (
                <ListingForm
                    initialValues={EMPTY_FORM}
                    initialSelectedAmenities={[]}
                    amenities={amenities}
                    onSubmit={handleSubmit}
                    onCancel={() =>
                        navigate("/host/listings")
                    }
                    loading={loading}
                    submitLabel="Create Listing"
                    submitError={submitError}
                />
            )}
        </div>
    );
}