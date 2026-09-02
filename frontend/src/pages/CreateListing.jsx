import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useListingService } from "../hooks/useListingService.js";


const Types = [
    "HOTEL",
    "PG",
    "HOSTEL",
    "APARTMENT",
    "VILLA",
    "HOMESTAY",
    "RESORT",
];


const emptyForm = {
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
    const { listingId } = useParams();
    const {
        createListing,
        updateListing,
        getHostListingById,
        getAmenities,
        updateListingAmenities
    } = useListingService();

    const { isAuthenticated } = useHoteruAuth();

    const isEditMode = Boolean(listingId);

    const [form, setForm] = useState(emptyForm);

    const [amenities, setAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const [loading, setLoading] = useState(isEditMode);
    const [errors, setErrors] = useState({});
    const [fetchError, setFetchError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Fetch amenities in both create and edit mode.
    // In edit mode we also fetch the existing listing.
    useEffect(() => {

        const controller = new AbortController();

        const loadData = async () => {
            try {
                setLoading(true);
                setFetchError(null);

                /*
                 * Amenities are required in both modes.
                 */
                const amenitiesResponse = await getAmenities(controller.signal);

                setAmenities(amenitiesResponse.data || []);

                /*
                 * Only edit mode needs the existing
                 * listing.
                 */
                if (isEditMode) {
                    const listingResponse =
                        await getHostListingById(listingId, controller.signal);

                    const listing = listingResponse.data;

                    setForm({
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

                        latitude: listing.latitude ?? "",
                        longitude: listing.longitude ?? "",

                        bookingMode: listing.bookingMode || "",
                    });

                    const selectedIds =
                        (listing.amenities || []).map(
                            ({ amenity }) =>
                                amenity.amenityId
                        );

                    setSelectedAmenities(selectedIds);
                }

            } catch (err) {
                if (
                    err.name === "AbortError"
                ) {
                    return;
                }

                setFetchError(
                    err.message ||
                    "Unable to load listing information."
                );

            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => controller.abort();

    }, [
        isAuthenticated,
        listingId,
        isEditMode,
    ]);


    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };


    const toggleAmenity = (amenityId) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenityId)
                ? prev.filter(
                    (id) => id !== amenityId
                )
                : [...prev, amenityId]
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setErrors({});

            if (!isAuthenticated) {
                setSubmitError(
                    "Please log in to continue."
                );
                return;
            }

            // Only fields belonging to ListingBaseSchema.
            const listingData = {
                type: form.type,
                name: form.name,
                description: form.description,

                checkInTime:
                    form.checkInTime || undefined,

                checkOutTime:
                    form.checkOutTime || undefined,

                contactPhone:
                    form.contactPhone,

                contactEmail:
                    form.contactEmail || undefined,

                addressLine1:
                    form.addressLine1,

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

                bookingMode:
                    form.bookingMode,
            };


            let listingResponse;


            if (isEditMode) {

                // Update listing information.
                listingResponse = await updateListing(listingId, listingData);


                // Update amenities
                await updateListingAmenities(listingId, selectedAmenities);

            } else {

                // Create Listing
                listingResponse = await createListing(listingData);

                const newListingId = listingResponse.data.listingId;

                // Add selected amenities.
                await updateListingAmenities(newListingId, selectedAmenities);
            }


            // Navigate back to host listing details.
            const finalListingId =
                isEditMode
                    ? listingId
                    : listingResponse.data.listingId;

            navigate(
                `/host/listings/${finalListingId}`,
                {
                    replace: true,
                }
            );

        } catch (err) {

            if (err.errors) {
                setErrors(err.errors);
            } else {
                setSubmitError(
                    err.message ||
                    "Unable to save listing."
                );
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">
                <h3 className="text-xl my-5 font-bold">
                    Log in to edit listing
                </h3>

                <p className="text-gray-500">
                    Please log in to continue editing this listing.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">
                <p>
                    Loading listing information...
                </p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <p className="text-red-500">
                {fetchError}
            </p>
        );
    }

    return (
        <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">

            <h1 className="text-2xl font-bold mb-6">
                {isEditMode
                    ? "Update Your Listing"
                    : "Create Your Listing"}
            </h1>


            <form
                onSubmit={handleSubmit}
                className="max-w-4xl flex flex-col gap-y-8"
            >

                {/* Basic Information */}
                <section className="flex flex-col gap-y-4">

                    <h2 className="text-lg font-bold">
                        Basic Information
                    </h2>

                    <label className="flex flex-col gap-1">
                        <span>
                            Listing type
                        </span>

                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="">
                                Select listing type
                            </option>

                            {Types.map((type) => (
                                <option
                                    value={type}
                                    key={type}
                                >
                                    {type === "PG"
                                        ? "PG"
                                        : type
                                            .charAt(0)
                                            .toUpperCase() +
                                        type
                                            .slice(1)
                                            .toLowerCase()}
                                </option>
                            ))}
                        </select>

                        {errors.type && (
                            <span className="text-red-500 text-xs">
                                {errors.type}
                            </span>
                        )}
                    </label>


                    <label className="flex flex-col gap-1">

                        <span>
                            Listing name
                        </span>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter listing name"
                            required
                        />

                        {errors.name && (
                            <span className="text-red-500 text-xs">
                                {errors.name}
                            </span>
                        )}
                    </label>


                    <label className="flex flex-col gap-1">

                        <span>
                            Description
                        </span>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={6}
                            className="input-field resize-none"
                            placeholder="Describe your accommodation..."
                            required
                        />

                        {errors.description && (
                            <span className="text-red-500 text-xs">
                                {errors.description}
                            </span>
                        )}
                    </label>

                </section>


                {/* Booking Information */}
                <section className="flex flex-col gap-y-4">

                    <h2 className="text-lg font-bold">
                        Booking Information
                    </h2>


                    <div>

                        <p className="mb-2">
                            Booking mode
                        </p>


                        <div className="flex flex-col gap-y-2">

                            <label className="flex gap-2 items-center">

                                <input
                                    type="radio"
                                    name="bookingMode"
                                    value="ENTIRE_PROPERTY"
                                    checked={
                                        form.bookingMode ===
                                        "ENTIRE_PROPERTY"
                                    }
                                    onChange={handleChange}
                                />

                                Entire property

                            </label>


                            <label className="flex gap-2 items-center">

                                <input
                                    type="radio"
                                    name="bookingMode"
                                    value="PER_ROOM"
                                    checked={
                                        form.bookingMode ===
                                        "PER_ROOM"
                                    }
                                    onChange={handleChange}
                                />

                                Per room

                            </label>

                        </div>


                        {errors.bookingMode && (
                            <span className="text-red-500 text-xs">
                                {errors.bookingMode}
                            </span>
                        )}

                    </div>


                    <div className="grid md:grid-cols-2 gap-4">

                        <label className="flex flex-col gap-1">

                            <span>
                                Check-in time
                            </span>

                            <input
                                type="time"
                                name="checkInTime"
                                value={form.checkInTime}
                                onChange={handleChange}
                                className="input-field"
                            />

                            {errors.checkInTime && (
                                <span className="text-red-500 text-xs">
                                    {errors.checkInTime}
                                </span>
                            )}

                        </label>


                        <label className="flex flex-col gap-1">

                            <span>
                                Check-out time
                            </span>

                            <input
                                type="time"
                                name="checkOutTime"
                                value={form.checkOutTime}
                                onChange={handleChange}
                                className="input-field"
                            />

                            {errors.checkOutTime && (
                                <span className="text-red-500 text-xs">
                                    {errors.checkOutTime}
                                </span>
                            )}

                        </label>

                    </div>

                </section>


                {/* Contact */}
                <section className="flex flex-col gap-y-4">

                    <h2 className="text-lg font-bold">
                        Contact Information
                    </h2>


                    <label className="flex flex-col gap-1">

                        <span>
                            Phone
                        </span>

                        <input
                            type="tel"
                            name="contactPhone"
                            value={form.contactPhone}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="+91 9876543210"
                            required
                        />

                        {errors.contactPhone && (
                            <span className="text-red-500 text-xs">
                                {errors.contactPhone}
                            </span>
                        )}

                    </label>


                    <label className="flex flex-col gap-1">

                        <span>
                            Email{" "}
                            <span className="text-gray-400">
                                (optional)
                            </span>
                        </span>

                        <input
                            type="email"
                            name="contactEmail"
                            value={form.contactEmail}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="contact@example.com"
                        />

                        {errors.contactEmail && (
                            <span className="text-red-500 text-xs">
                                {errors.contactEmail}
                            </span>
                        )}

                    </label>

                </section>


                {/* Location */}
                <section className="flex flex-col gap-y-4">

                    <h2 className="text-lg font-bold">
                        Location
                    </h2>


                    <label className="flex flex-col gap-1">

                        <span>
                            Address line 1
                        </span>

                        <input
                            name="addressLine1"
                            value={form.addressLine1}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />

                        {errors.addressLine1 && (
                            <span className="text-red-500 text-xs">
                                {errors.addressLine1}
                            </span>
                        )}

                    </label>


                    <label className="flex flex-col gap-1">

                        <span>
                            Address line 2
                        </span>

                        <input
                            name="addressLine2"
                            value={form.addressLine2}
                            onChange={handleChange}
                            className="input-field"
                        />

                        {errors.addressLine2 && (
                            <span className="text-red-500 text-xs">
                                {errors.addressLine2}
                            </span>
                        )}

                    </label>


                    <label className="flex flex-col gap-1">

                        <span>
                            Landmark
                        </span>

                        <input
                            name="landmark"
                            value={form.landmark}
                            onChange={handleChange}
                            className="input-field"
                        />

                        {errors.landmark && (
                            <span className="text-red-500 text-xs">
                                {errors.landmark}
                            </span>
                        )}

                    </label>


                    <div className="grid md:grid-cols-2 gap-4">

                        <label className="flex flex-col gap-1">

                            <span>
                                City
                            </span>

                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />

                            {errors.city && (
                                <span className="text-red-500 text-xs">
                                    {errors.city}
                                </span>
                            )}

                        </label>


                        <label className="flex flex-col gap-1">

                            <span>
                                State
                            </span>

                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />

                            {errors.state && (
                                <span className="text-red-500 text-xs">
                                    {errors.state}
                                </span>
                            )}

                        </label>


                        <label className="flex flex-col gap-1">

                            <span>
                                Country
                            </span>

                            <input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />

                            {errors.country && (
                                <span className="text-red-500 text-xs">
                                    {errors.country}
                                </span>
                            )}

                        </label>


                        <label className="flex flex-col gap-1">

                            <span>
                                Postal code
                            </span>

                            <input
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />

                            {errors.postalCode && (
                                <span className="text-red-500 text-xs">
                                    {errors.postalCode}
                                </span>
                            )}

                        </label>

                    </div>


                    <div className="grid md:grid-cols-2 gap-4">

                        <label className="flex flex-col gap-1">

                            <span>
                                Latitude{" "}
                                <span className="text-gray-400">
                                    (optional)
                                </span>
                            </span>

                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                value={form.latitude}
                                onChange={handleChange}
                                className="input-field"
                            />

                            {errors.latitude && (
                                <span className="text-red-500 text-xs">
                                    {errors.latitude}
                                </span>
                            )}

                        </label>


                        <label className="flex flex-col gap-1">

                            <span>
                                Longitude{" "}
                                <span className="text-gray-400">
                                    (optional)
                                </span>
                            </span>

                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                value={form.longitude}
                                onChange={handleChange}
                                className="input-field"
                            />

                            {errors.longitude && (
                                <span className="text-red-500 text-xs">
                                    {errors.longitude}
                                </span>
                            )}

                        </label>

                    </div>

                </section>


                {/* Amenities */}
                <section className="flex flex-col gap-y-4">

                    <h2 className="text-lg font-bold">
                        Amenities
                    </h2>

                    <p className="text-sm text-gray-500">
                        Select the amenities available at
                        your accommodation.
                    </p>


                    <div className="flex flex-wrap gap-2">

                        {amenities.map((amenity) => {

                            const selected =
                                selectedAmenities.includes(
                                    amenity.amenityId
                                );

                            return (
                                <button
                                    type="button"
                                    key={amenity.amenityId}
                                    onClick={() =>
                                        toggleAmenity(
                                            amenity.amenityId
                                        )
                                    }
                                    className={`
                                        px-4
                                        py-2
                                        rounded-full
                                        border
                                        cursor-pointer
                                        transition
                                        ${selected
                                            ? "bg-primary text-white border-primary"
                                            : "bg-base-200 border-gray-300 hover:bg-base-300"
                                        }
                                    `}
                                >
                                    {amenity.name}
                                </button>
                            );
                        })}

                    </div>


                    {errors.amenityIds && (
                        <span className="text-red-500 text-xs">
                            {errors.amenityIds}
                        </span>
                    )}

                </section>


                {/* Error */}
                {submitError && (
                    <p className="text-red-500 text-sm">
                        {submitError}
                    </p>
                )}


                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                        w-full
                        md:w-max
                        md:px-10
                        bg-primary
                        text-white
                        rounded-full
                        py-3
                        font-semibold
                        cursor-pointer
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    {isSubmitting
                        ? (
                            isEditMode
                                ? "Updating Listing..."
                                : "Creating Listing..."
                        )
                        : (
                            isEditMode
                                ? "Update Listing"
                                : "Create Listing"
                        )
                    }
                </button>

            </form>
        </div>
    );
};