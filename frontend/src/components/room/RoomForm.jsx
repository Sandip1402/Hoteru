import { useEffect, useState } from "react";

const ROOM_TYPES = [
    "SINGLE",
    "DOUBLE",
    "TWIN",
    "TRIPLE",
    "QUAD",
    "DORMITORY",
    "SUITE",
    "DELUXE",
    "FAMILY",
    "STUDIO",
    "ENTIRE_UNIT",
];

const DEFAULT_VALUES = {
    name: "",
    description: "",
    roomType: "",
    maxGuests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    basePrice: "",
    quantity: 1,
    area: "",
    areaUnit: "",
    isActive: true,
};

export const RoomForm = ({
    initialValues = DEFAULT_VALUES,
    onSubmit,
    onCancel,
    loading = false,
    submitLabel = "Save Room",
}) => {
    const [formData, setFormData] =
        useState(initialValues);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            ...DEFAULT_VALUES,
            ...initialValues,
        });

        setErrors({});
    }, [initialValues]);

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrors({});

        try {
            await onSubmit(formData);
        } catch (error) {
            if (error?.errors) {
                setErrors(error.errors);
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Basic Information */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Basic Information
                </h2>

                <div className="space-y-4">
                    <Field
                        label="Room name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full rounded-lg border px-3 py-2"
                        />

                        {errors.description && (
                            <Error
                                message={
                                    errors.description
                                }
                            />
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Room type
                        </label>

                        <select
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">
                                Select room type
                            </option>

                            {ROOM_TYPES.map(
                                (type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type.replace(
                                            "_",
                                            " "
                                        )}
                                    </option>
                                )
                            )}
                        </select>

                        {errors.roomType && (
                            <Error
                                message={
                                    errors.roomType
                                }
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Capacity */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Capacity & Layout
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                        label="Maximum guests"
                        name="maxGuests"
                        value={formData.maxGuests}
                        onChange={handleChange}
                        error={errors.maxGuests}
                        min="1"
                    />

                    <NumberField
                        label="Bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        error={errors.bedrooms}
                        min="0"
                    />

                    <NumberField
                        label="Beds"
                        name="beds"
                        value={formData.beds}
                        onChange={handleChange}
                        error={errors.beds}
                        min="1"
                    />

                    <NumberField
                        label="Bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        error={errors.bathrooms}
                        min="0.5"
                        step="0.5"
                    />
                </div>
            </section>

            {/* Pricing */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Pricing
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                        label="Base price per night"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        error={errors.basePrice}
                        min="0.01"
                        step="0.01"
                    />
                </div>
            </section>

            {/* Area */}
            <section>
                <h2 className="mb-4 text-lg font-semibold">
                    Room Area
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                        label="Area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        error={errors.area}
                        min="0.01"
                        step="0.01"
                    />

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Area unit
                        </label>

                        <select
                            name="areaUnit"
                            value={formData.areaUnit}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">
                                Select unit
                            </option>

                            <option value="SQ_FT">
                                Square feet
                            </option>

                            <option value="SQ_M">
                                Square meters
                            </option>
                        </select>

                        {errors.areaUnit && (
                            <Error
                                message={
                                    errors.areaUnit
                                }
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Active */}
            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                />

                <span className="text-sm font-medium">
                    Room is active
                </span>
            </label>

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
                    className="rounded-lg bg-black px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : submitLabel}
                </button>
            </div>
        </form>
    );
};

function Field({
    label,
    name,
    value,
    onChange,
    error,
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium">
                {label}
            </label>

            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border px-3 py-2"
            />

            {error && <Error message={error} />}
        </div>
    );
}

function NumberField({
    label,
    name,
    value,
    onChange,
    error,
    min,
    step = "1",
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium">
                {label}
            </label>

            <input
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                min={min}
                step={step}
                className="w-full rounded-lg border px-3 py-2"
            />

            {error && <Error message={error} />}
        </div>
    );
}

function Error({ message }) {
    return (
        <p className="mt-1 text-sm text-red-500">
            {message}
        </p>
    );
}
