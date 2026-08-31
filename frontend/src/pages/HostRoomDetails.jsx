import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
    getHostRoomById,
    getRoomImages,
    uploadRoomImage,
    deleteRoomImage,
} from "../apis/roomApi";
import { useHoteruAuth } from "../auth/HoteruAuthProvider";

const FALLBACK_IMAGE = "/images/room-placeholder.jpg";

export const HostRoomDetails = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useHoteruAuth();

    const [room, setRoom] = useState(null);
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [imagesLoading, setImagesLoading] = useState(true);

    const [error, setError] = useState("");
    const [imagesError, setImagesError] = useState("");

    // Image upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);

    // Image delete
    const [deletingImageId, setDeletingImageId] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                setError("");

                const accessToken =
                    await getAccessTokenSilently();

                const response = await getHostRoomById(
                    Number(roomId),
                    accessToken
                );

                setRoom(response.data);
            } catch (error) {
                console.error(
                    "Failed to fetch room:",
                    error
                );

                setError(
                    error?.message ||
                    "Failed to load room details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId, getAccessTokenSilently]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setImagesLoading(true);
                setImagesError("");

                const response = await getRoomImages(
                    Number(roomId),
                );

                setImages(response.data || []);
            } catch (error) {
                console.error(
                    "Failed to fetch room images:",
                    error
                );

                setImagesError(
                    error?.message ||
                    "Failed to load room images."
                );
            } finally {
                setImagesLoading(false);
            }
        };

        fetchImages();
    }, [roomId]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            setPreviewUrl(null);
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));

        setUploadError("");
        setUploadSuccess("");
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError("Please select an image.");
            return;
        }

        try {
            setUploading(true);
            setUploadError("");
            setUploadSuccess("");

            const accessToken =
                await getAccessTokenSilently();

            await uploadRoomImage(
                Number(roomId),
                selectedFile,
                accessToken
            );

            setSelectedFile(null);
            setPreviewUrl(null);
            setUploadSuccess(
                "Room image uploaded successfully."
            );

            // Refresh images
            const response = await getRoomImages(
                Number(roomId),
                accessToken
            );

            setImages(response.data || []);

        } catch (error) {
            console.error(
                "Failed to upload room image:",
                error
            );

            setUploadError(
                error?.message ||
                "Failed to upload room image."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingImageId(imageId);
            setUploadError("");
            setUploadSuccess("");

            const accessToken =
                await getAccessTokenSilently();

            await deleteRoomImage(
                imageId,
                accessToken
            );

            // Refresh images
            const response = await getRoomImages(
                Number(roomId),
                accessToken
            );

            setImages(response.data || []);

            setUploadSuccess(
                "Room image deleted successfully."
            );
        } catch (error) {
            console.error(
                "Failed to delete room image:",
                error
            );

            setUploadError(
                error?.message ||
                "Failed to delete room image."
            );
        } finally {
            setDeletingImageId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading room...</p>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    {error || "Room not found."}
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link
                        to={`/host/listings/${room.listingId}`}
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        ← Back to listing
                    </Link>

                    <h1 className="mt-3 text-2xl font-semibold">
                        {room.name}
                    </h1>

                    <p className="text-gray-500">
                        {room.roomType}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/host/rooms/${room.roomId}/edit`
                        )
                    }
                    className="rounded-lg bg-black px-4 py-2 text-white"
                >
                    Edit Room
                </button>
            </div>

            {/* Images */}
            <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Room Images
                    </h2>
                </div>

                {/* Existing images */}
                {imagesLoading && (
                    <p className="mb-4 text-gray-500">
                        Loading images...
                    </p>
                )}

                {imagesError && (
                    <p className="mb-4 text-red-500">
                        {imagesError}
                    </p>
                )}

                {!imagesLoading &&
                    !imagesError &&
                    images.length === 0 && (
                        <div className="mb-4 rounded-lg border border-dashed p-8 text-center text-gray-500">
                            No room images uploaded yet.
                        </div>
                    )}

                {!imagesLoading &&
                    !imagesError &&
                    images.length > 0 && (
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {images.map((image) => (
                                <div
                                    key={image.imageId}
                                    className="relative overflow-hidden rounded-lg border"
                                >
                                    <img
                                        src={image.imageUrl}
                                        alt={image.altText || room.name}
                                        className="h-52 w-full object-cover"
                                    />

                                    {image.isCover && (
                                        <span className="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-xs text-white">
                                            Cover
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteImage(image.imageId)
                                        }
                                        disabled={
                                            deletingImageId === image.imageId
                                        }
                                        className="absolute right-2 top-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {deletingImageId === image.imageId
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                {previewUrl && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm font-medium">
                            Preview
                        </p>

                        <img
                            src={previewUrl}
                            alt="Selected room"
                            className="h-48 w-full rounded-lg object-cover sm:w-80"
                        />
                    </div>
                )}

                {/* Image Upload */}
                <div className="rounded-lg border border-dashed p-6">
                    <h3 className="font-medium">
                        Add Room Image
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Upload an image for this room.
                    </p>

                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="block w-full text-sm"
                        />

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className="rounded-lg bg-black px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload Image"}
                        </button>
                    </div>

                    {selectedFile && (
                        <p className="mt-3 text-sm text-gray-600">
                            Selected: {selectedFile.name}
                        </p>
                    )}

                    {uploadError && (
                        <p className="mt-3 text-sm text-red-500">
                            {uploadError}
                        </p>
                    )}

                    {uploadSuccess && (
                        <p className="mt-3 text-sm text-green-600">
                            {uploadSuccess}
                        </p>
                    )}
                </div>
            </section>

            {/* Room description */}
            <section className="mb-8">
                <h2 className="mb-3 text-xl font-semibold">
                    About this room
                </h2>

                <p className="leading-7 text-gray-600">
                    {room.description ||
                        "No description provided."}
                </p>
            </section>

            {/* Room information */}
            <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">
                    Room Information
                </h2>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <InfoItem
                        label="Room type"
                        value={room.roomType}
                    />

                    <InfoItem
                        label="Maximum guests"
                        value={room.maxGuests}
                    />

                    <InfoItem
                        label="Beds"
                        value={room.beds}
                    />

                    <InfoItem
                        label="Bedrooms"
                        value={
                            room.bedrooms ??
                            "Not specified"
                        }
                    />

                    <InfoItem
                        label="Bathrooms"
                        value={room.bathrooms}
                    />

                    <InfoItem
                        label="Quantity"
                        value={room.quantity}
                    />

                    {room.area != null && (
                        <InfoItem
                            label="Area"
                            value={`${room.area} ${room.areaUnit}`}
                        />
                    )}
                </div>
            </section>

            {/* Pricing */}
            <section className="mb-8">
                <h2 className="mb-3 text-xl font-semibold">
                    Pricing
                </h2>

                <p className="text-2xl font-semibold">
                    ₹{room.basePrice}
                    <span className="text-sm font-normal text-gray-500">
                        {" "}
                        / night
                    </span>
                </p>
            </section>

            {/* Status */}
            <section>
                <h2 className="mb-3 text-xl font-semibold">
                    Status
                </h2>

                <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm ${room.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {room.isActive
                        ? "Active"
                        : "Inactive"}
                </span>
            </section>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-1 font-medium">
                {value}
            </p>
        </div>
    );
}