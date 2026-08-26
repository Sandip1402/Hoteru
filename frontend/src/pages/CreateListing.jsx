import { useState } from "react";
import { useNavigate } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { createListing } from "../apis/listingApi.js";

const initialForm = {
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

const Types = [
    "HOTEL",
    "PG",
    "HOSTEL",
    "APARTMENT",
    "VILLA",
    "HOMESTAY",
    "RESORT",
]

export const CreateListing = () => {
    const navigate = useNavigate();

    const {
        isAuthenticated,
        getAccessTokenSilently,
    } = useHoteruAuth();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setSubmitError("Please log in to create a listing.");
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setErrors({});

            const token = await getAccessTokenSilently();

            /*
             * Build the payload.
             * Empty optional values are removed
             */
            const payload = {
                type: form.type,
                name: form.name,
                description: form.description,

                contactPhone: form.contactPhone,
                addressLine1: form.addressLine1,
                city: form.city,
                state: form.state,
                country: form.country,
                postalCode: form.postalCode,

                bookingMode: form.bookingMode,
            };

            if (form.checkInTime) {
                payload.checkInTime = form.checkInTime;
            }

            if (form.checkOutTime) {
                payload.checkOutTime = form.checkOutTime;
            }

            if (form.contactEmail) {
                payload.contactEmail = form.contactEmail;
            }

            if (form.addressLine2) {
                payload.addressLine2 = form.addressLine2;
            }

            if (form.landmark) {
                payload.landmark = form.landmark;
            }

            if (form.latitude !== "") {
                payload.latitude = form.latitude;
            }

            if (form.longitude !== "") {
                payload.longitude = form.longitude;
            }

            const response = await createListing(
                payload,
                token
            );

            const listing = response.data;

            /*
             * Listing has now been created as DRAFT.
             */
            navigate( // fix
                `/host/listings/${listing.listingId}`,
                {
                    replace: true,
                    state: {
                        listing,
                    },
                }
            );

        } catch (err) {
            console.error(
                "Failed to create listing:", err
            );

            if (err.errors) {
                setErrors(err.errors);
            }

            setSubmitError(
                err.message || "Unable to create listing."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">

            <h1 className="text-2xl font-bold mb-6">
                Create Your Listing
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
                        <span>Listing type</span>

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
                                <option value={type} key={type}>
                                    {type === "PG" ? "PG" : type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                        {errors.type && <span className="text-red-500 text-xs">{errors.type}</span>}
                    </label>

                    <label className="flex flex-col gap-1">
                        <span>Listing name</span>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter listing name"
                            required
                        />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                    </label>

                    <label className="flex flex-col gap-1">
                        <span>Description</span>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={6}
                            className="input-field resize-none"
                            placeholder="Describe your accommodation..."
                            required
                        />
                        {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
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
                        {errors.bookingMode && <span className="text-red-500 text-xs">{errors.bookingMode}</span>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                        <label className="flex flex-col gap-1">
                            <span>Check-in time</span>

                            <input
                                type="time"
                                name="checkInTime"
                                value={form.checkInTime}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.checkInTime && <span className="text-red-500 text-xs">{errors.checkInTime}</span>}
                        </label>

                        <label className="flex flex-col gap-1">
                            <span>Check-out time</span>

                            <input
                                type="time"
                                name="checkOutTime"
                                value={form.checkOutTime}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.checkOutTime && <span className="text-red-500 text-xs">{errors.checkOutTime}</span>}
                        </label>

                    </div>
                </section>


                {/* Contact */}
                <section className="flex flex-col gap-y-4">
                    <h2 className="text-lg font-bold">
                        Contact Information
                    </h2>

                    <label className="flex flex-col gap-1">
                        <span>Phone</span>

                        <input
                            type="tel"
                            name="contactPhone"
                            value={form.contactPhone}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="+91 9876543210"
                            required
                        />
                        {errors.contactPhone && <span className="text-red-500 text-xs">{errors.contactPhone}</span>}
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
                        {errors.contactEmail && <span className="text-red-500 text-xs">{errors.contactEmail}</span>}
                    </label>
                </section>


                {/* Location */}
                <section className="flex flex-col gap-y-4">
                    <h2 className="text-lg font-bold">
                        Location
                    </h2>

                    <label className="flex flex-col gap-1">
                        <span>Address line 1</span>

                        <input
                            name="addressLine1"
                            value={form.addressLine1}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        {errors.addressLine1 && <span className="text-red-500 text-xs">{errors.addressLine1}</span>}
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
                        {errors.addressLine2 && <span className="text-red-500 text-xs">{errors.addressLine2}</span>}
                    </label>

                    <label className="flex flex-col gap-1">
                        <span>Landmark</span>

                        <input
                            name="landmark"
                            value={form.landmark}
                            onChange={handleChange}
                            className="input-field"
                        />
                        {errors.landmark && <span className="text-red-500 text-xs">{errors.landmark}</span>}
                    </label>

                    <div className="grid md:grid-cols-2 gap-4">

                        <label className="flex flex-col gap-1">
                            <span>City</span>

                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                            {errors.city && <span className="text-red-500 text-xs">{errors.city}</span>}
                        </label>

                        <label className="flex flex-col gap-1">
                            <span>State</span>

                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                            {errors.city && <span className="text-red-500 text-xs">{errors.city}</span>}
                        </label>

                        <label className="flex flex-col gap-1">
                            <span>Country</span>

                            <input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                            {errors.country && <span className="text-red-500 text-xs">{errors.country}</span>}
                        </label>

                        <label className="flex flex-col gap-1">
                            <span>Postal code</span>

                            <input
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                            {errors.postalCode && <span className="text-red-500 text-xs">{errors.postalCode}</span>}
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
                            {errors.latitude && <span className="text-red-500 text-xs">{errors.latitude}</span>}
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
                            {errors.longitude && <span className="text-red-500 text-xs">{errors.longitude}</span>}
                        </label>

                    </div>
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
                        ? "Creating Listing..."
                        : "Create Listing"}
                </button>

            </form>
        </div>
    );
};