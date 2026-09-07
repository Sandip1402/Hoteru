import { useEffect, useState } from "react";

const LISTING_TYPES = [
    "HOTEL",
    "PG",
    "HOSTEL",
    "APARTMENT",
    "VILLA",
    "HOMESTAY",
    "RESORT",
];

const DEFAULT_VALUES = {
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

const FieldError = ({ message }) => {
    if (!message) return null;

    return (
        <p className="mt-1 text-sm text-red-600">
            {Array.isArray(message) ? message[0] : message}
        </p>
    );
};

const InputField = ({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    required = false,
    placeholder,
    ...props
}) => (
    <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
        </label>

        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="input-field"
            {...props}
        />

        <FieldError message={error} />
    </div>
);

const TextAreaField = ({
    label,
    name,
    value,
    onChange,
    error,
    required = false,
    placeholder,
}) => (
    <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
        </label>

        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={4}
            className="input-field resize-none"
        />

        <FieldError message={error} />
    </div>
);

export const ListingForm = ({
    initialValues = DEFAULT_VALUES,
    initialSelectedAmenities = [],
    amenities = [],
    onSubmit,
    onCancel,
    loading = false,
    submitLabel = "Save Listing",
    submitError = null,
}) => {
    const [formData, setFormData] = useState({
        ...DEFAULT_VALUES,
        ...initialValues,
    });

    const [selectedAmenities, setSelectedAmenities] = useState(
        initialSelectedAmenities || []
    );

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            ...DEFAULT_VALUES,
            ...initialValues,
        });

        setErrors({});
    }, [initialValues]);

    useEffect(() => {
        setSelectedAmenities(initialSelectedAmenities || []);
    }, [initialSelectedAmenities]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const handleBookingModeChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            bookingMode: value,
        }));

        setErrors((prev) => ({
            ...prev,
            bookingMode: undefined,
        }));
    };

    const toggleAmenity = (amenityId) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenityId)
                ? prev.filter((id) => id !== amenityId)
                : [...prev, amenityId]
        );

        setErrors((prev) => ({
            ...prev,
            amenityIds: undefined,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        try {
            await onSubmit(formData, selectedAmenities);
        } catch (error) {
            if (error?.errors) {
                setErrors(error.errors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* Basic Information */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Basic Information
                </h2>

                <div className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Listing Type
                            <span className="text-red-500"> *</span>
                        </label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="">Select listing type</option>

                            {LISTING_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace("_", " ")}
                                </option>
                            ))}
                        </select>

                        <FieldError message={errors.type} />
                    </div>

                    <InputField
                        label="Listing Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                        placeholder="Enter listing name"
                    />

                    <TextAreaField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        error={errors.description}
                        placeholder="Describe your property"
                    />
                </div>
            </section>

            {/* Booking Information */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Booking Information
                </h2>

                <div className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Booking Mode
                            <span className="text-red-500"> *</span>
                        </label>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="bookingMode"
                                    value="ENTIRE_PROPERTY"
                                    checked={
                                        formData.bookingMode ===
                                        "ENTIRE_PROPERTY"
                                    }
                                    onChange={() =>
                                        handleBookingModeChange(
                                            "ENTIRE_PROPERTY"
                                        )
                                    }
                                />

                                <span>Entire Property</span>
                            </label>

                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="bookingMode"
                                    value="PER_ROOM"
                                    checked={
                                        formData.bookingMode === "PER_ROOM"
                                    }
                                    onChange={() =>
                                        handleBookingModeChange("PER_ROOM")
                                    }
                                />

                                <span>Per Room</span>
                            </label>
                        </div>

                        <FieldError message={errors.bookingMode} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <InputField
                            label="Check-in Time"
                            name="checkInTime"
                            type="time"
                            value={formData.checkInTime}
                            onChange={handleChange}
                            error={errors.checkInTime}
                        />

                        <InputField
                            label="Check-out Time"
                            name="checkOutTime"
                            type="time"
                            value={formData.checkOutTime}
                            onChange={handleChange}
                            error={errors.checkOutTime}
                        />
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Contact Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                        label="Contact Phone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        error={errors.contactPhone}
                        required
                        placeholder="Enter contact phone"
                    />

                    <InputField
                        label="Contact Email"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        error={errors.contactEmail}
                        placeholder="Enter contact email"
                    />
                </div>
            </section>

            {/* Location */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Location
                </h2>

                <div className="space-y-5">

                    <InputField
                        label="Address Line 1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        error={errors.addressLine1}
                        required
                        placeholder="Street address"
                    />

                    <InputField
                        label="Address Line 2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        error={errors.addressLine2}
                        placeholder="Apartment, suite, etc."
                    />

                    <InputField
                        label="Landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        error={errors.landmark}
                        placeholder="Nearby landmark"
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                        <InputField
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            error={errors.city}
                            required
                        />

                        <InputField
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            error={errors.state}
                            required
                        />

                        <InputField
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            error={errors.country}
                            required
                        />

                        <InputField
                            label="Postal Code"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            error={errors.postalCode}
                            required
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <InputField
                            label="Latitude"
                            name="latitude"
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={handleChange}
                            error={errors.latitude}
                            placeholder="Optional"
                        />

                        <InputField
                            label="Longitude"
                            name="longitude"
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={handleChange}
                            error={errors.longitude}
                            placeholder="Optional"
                        />
                    </div>
                </div>
            </section>

            {/* Amenities */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Amenities
                </h2>

                {amenities.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No amenities available.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {amenities.map((amenity) => {
                            const amenityId = amenity.amenityId;

                            const isSelected = selectedAmenities.includes(amenityId);

                            return (
                                <label
                                    key={amenityId}
                                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 ${
                                        isSelected
                                            ? "border-black bg-gray-50"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() =>
                                            toggleAmenity(amenityId)
                                        }
                                    />

                                    <span className="text-sm">
                                        {amenity.name}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}

                <FieldError message={errors.amenityIds} />
            </section>

            {/* Server Error */}
            {submitError && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {submitError}
                </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-lg border px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-primary px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
};