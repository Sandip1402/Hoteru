import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

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

export const EditListing = () => {
    const navigate = useNavigate();
    const { listingId } = useParams();

    const { isAuthenticated } = useHoteruAuth();

    const {
        getHostListingById,
        getAmenities,
        updateListing,
        updateListingAmenities,
    } = useListingService();

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [amenities, setAmenities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [amenitiesLoading, setAmenitiesLoading] = useState(true);

    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || !listingId) return;

        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setAmenitiesLoading(true);

                const [listingResponse, amenitiesResponse] =
                    await Promise.all([
                        getHostListingById(
                            listingId,
                            controller.signal
                        ),
                        getAmenities(controller.signal),
                    ]);

                const listing = listingResponse.data;

                setFormData({
                    type: listing.type || "",
                    name: listing.name || "",
                    description: listing.description || "",

                    checkInTime: listing.checkInTime || "",
                    checkOutTime: listing.checkOutTime || "",

                    contactPhone: listing.contactPhone || "",
                    contactEmail: listing.contactEmail || "",

                    addressLine1: listing.addressLine1 || "",
                    addressLine2: listing.addressLine2 || "",
                    landmark: listing.landmark || "",

                    city: listing.city || "",
                    state: listing.state || "",
                    country: listing.country || "",
                    postalCode: listing.postalCode || "",

                    latitude:
                        listing.latitude != null
                            ? String(listing.latitude)
                            : "",

                    longitude:
                        listing.longitude != null
                            ? String(listing.longitude)
                            : "",

                    bookingMode: listing.bookingMode || "",
                });

                setAmenities(amenitiesResponse.data || []);

                /*
                 * Adjust this according to the exact shape returned
                 * by your GET host listing API.
                 *
                 * Expected examples:
                 * listing.amenities = [{ amenityId: 1, ... }]
                 * OR
                 * listing.amenities = [1, 2, 3]
                 */
                const listingAmenityIds = (listing.amenities || []).map(
                    (item) => item.amenity.amenityId
                );

                setSelectedAmenities(listingAmenityIds);

                setSelectedAmenities(listingAmenityIds);
            } catch (error) {
                if (error.name === "AbortError") return;

                console.error(
                    "Failed to load listing:",
                    error
                );

                setSubmitError(
                    error?.message ||
                    "Failed to load listing."
                );
            } finally {
                setLoading(false);
                setAmenitiesLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [
        isAuthenticated,
        listingId
    ]);

    const handleSubmit = async (
        form,
        selectedAmenityIds
    ) => {
        setSubmitError(null);
        setSubmitLoading(true);

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

            await updateListing(
                Number(listingId),
                listingData,
            );

            await updateListingAmenities(
                Number(listingId),
                selectedAmenityIds,
            );

            navigate(
                `/host/listings/${listingId}`,
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(
                "Failed to update listing:",
                error
            );

            /*
             * Let ListingForm handle Zod field errors.
             */
            if (error?.errors) {
                throw error;
            }

            setSubmitError(
                error?.message ||
                "Failed to update listing."
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-6">
                <p>Log in to continue.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8">
                <p className="text-sm text-gray-500">
                    Loading listing...
                </p>
            </div>
        );
    }

    if (submitError && !formData.name) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8">
                <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {submitError}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/host/listings/${listingId}`
                        )
                    }
                    className="mt-4 rounded-lg border px-5 py-2.5"
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    Edit Listing
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update your property details.
                </p>
            </div>

            {amenitiesLoading ? (
                <p className="text-sm text-gray-500">
                    Loading amenities...
                </p>
            ) : (
                <ListingForm
                    initialValues={formData}
                    initialSelectedAmenities={
                        selectedAmenities
                    }
                    amenities={amenities}
                    onSubmit={handleSubmit}
                    onCancel={() =>
                        navigate(
                            `/host/listings/${listingId}`
                        )
                    }
                    loading={submitLoading}
                    submitLabel="Update Listing"
                    submitError={submitError}
                />
            )}
        </div>
    );
}