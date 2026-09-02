import { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
    useParams,
} from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { useListingService } from "../hooks/useListingService.js";
import { RoomCard } from "../components/room/RoomCard.jsx";

export const HostListingDetails = () => {
    const { listingId } = useParams();
    const { state } = useLocation();

    const navigate = useNavigate();

    const { isAuthenticated } = useHoteruAuth();

    const {
        getHostListingById,
        uploadListingImage,
        deleteListingImage,
        getListingImages,
        makeListingImageThumbnail,
        getListingRooms
    } = useListingService();

    const [listing, setListing] = useState(state?.listing || null);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(!state?.listing);
    const [roomsLoading, setRoomsLoading] = useState(true);

    const [error, setError] = useState(null);
    const [roomsError, setRoomsError] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);

    const [caption, setCaption] = useState("");

    const [isUploading, setIsUploading] = useState(false);

    const [deletingImageId, setDeletingImageId] = useState(null);

    const [imageError, setImageError] = useState(null);

    const [thumbnailImageId, setThumbnailImageId] = useState(null);


    /*
     * Fetch listing if it wasn't provided
     * through router state.
     */
    useEffect(() => {
        const controller = new AbortController();

        const fetchListingData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!isAuthenticated) {
                    setError(
                        "Please log in to view your listing."
                    );
                    return;
                }

                /*
                 * If listing was passed through router state,
                 * the listing itself is already available.
                 * Only fetch its images because GET /listings/host
                 * intentionally does not include them.
                 */
                if (listing) {
                    const response = await getListingImages(listingId, controller.signal);

                    setListing((prev) => ({
                        ...prev,
                        images: response.data,
                    }));

                    return;
                }
                const response = await getHostListingById(listingId, controller.signal);

                setListing(response.data);
            } catch (err) {
                if (
                    err.name === "AbortError"
                ) {
                    return;
                }

                console.error(
                    "Failed to fetch listing:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load listing."
                );

            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        };

        fetchListingData();
        return () => controller.abort();
    }, [
        listingId,
        isAuthenticated,
    ]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchRooms = async () => {
            try {
                setRoomsLoading(true);
                setRoomsError(null);

                const response = await getListingRooms(
                    listingId,
                    controller.signal
                );

                setRooms(response.data);
            } catch (err) {
                if (err.name === "AbortError") return;

                console.error("Failed to fetch rooms:", err);
                setRoomsError("Unable to load rooms.");
            } finally {
                if (!controller.signal.aborted) {
                    setRoomsLoading(false);
                }
            }
        };

        fetchRooms();

        return () => controller.abort();
    }, [listingId]);

    const handleUpload = async () => {
        if (!selectedFile) {
            setImageError(
                "Please select an image."
            );
            return;
        }

        try {
            setIsUploading(true);
            setImageError(null);

            const response =
                await uploadListingImage(
                    listing.listingId,
                    selectedFile,
                    caption.trim()
                );

            /*
             * Add newly uploaded image to
             * current listing.
             */
            setListing((prev) => ({
                ...prev,
                images: [
                    ...(prev.images || []),
                    response.data,
                ],
            }));

            setSelectedFile(null);
            setCaption("");

            /*
             * Reset file input.
             */
            document.getElementById(
                "listing-image"
            ).value = "";

        } catch (err) {
            console.error(
                "Failed to upload listing image:",
                err
            );

            setImageError(
                err.message ||
                "Unable to upload image."
            );

        } finally {
            setIsUploading(false);
        }
    };


    const handleDeleteImage = async (
        imageId
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) {
            return;
        }
        try {
            setDeletingImageId(imageId);
            setImageError(null);

            await deleteListingImage(listing.listingId, imageId);

            /*
             * Remove image locally instead of
             * making another GET request.
             */
            setListing((prev) => ({
                ...prev,
                images: prev.images.filter(
                    (image) =>
                        image.imageId !== imageId
                ),
            }));

        } catch (err) {
            console.error(
                "Failed to delete listing image:",
                err
            );

            setImageError(
                err.message ||
                "Unable to delete image."
            );

        } finally {
            setDeletingImageId(null);
        }
    };

    const handleMakeThumbnail = async (imageId) => {
        try {
            setThumbnailImageId(imageId);
            setImageError(null);

            await makeListingImageThumbnail( imageId );

            // Update local state.
            // Backend makes the selected image the
            // thumbnail and removes thumbnail status
            // from the previous one.
            setListing((prev) => ({
                ...prev,
                images: prev.images.map((image) => ({
                    ...image,
                    isThumbnail:
                        image.imageId === imageId,
                })),
            }));
        } catch (err) {
            console.error(
                "Failed to update listing thumbnail:",
                err
            );

            setImageError(
                err.message ||
                "Unable to update listing thumbnail."
            );

        } finally {
            setThumbnailImageId(null);
        }
    };


    if (loading) {
        return (
            <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">
                Loading listing...
            </div>
        );
    }


    if (!listing) {
        return (
            <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">
                <h2 className="text-xl font-bold">
                    Listing not found
                </h2>

                <button
                    onClick={() =>
                        navigate(
                            "/host/listings"
                        )
                    }
                    className="
                        mt-5
                        bg-primary
                        text-white
                        rounded-full
                        px-5
                        py-2
                    "
                >
                    Back to listings
                </button>
            </div>
        );
    }


    return (
        <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">

            {/* Back */}
            <Link
                to="/host/listings"
                className="
                    inline-block
                    mb-5
                    text-gray-500
                    hover:underline
                "
            >
                ← Back to listings
            </Link>


            {/* Listing header */}
            <div className="flex flex-col gap-y-1 mb-8">

                <div className="flex items-center gap-3">

                    <h1 className="text-2xl font-bold">
                        {listing.name}
                    </h1>

                    <span className="text-xs bg-base-300 px-3 py-1 rounded-full">
                        {listing.status}
                    </span>

                </div>

                <p className="text-gray-500">
                    {listing.type} · {listing.city},{" "}
                    {listing.state}
                </p>

            </div>


            {/* Listing information */}
            <section className="mb-10">

                <h2 className="text-lg font-bold mb-4">
                    Listing Information
                </h2>

                <div className="grid gap-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-gray-500">
                            Description
                        </p>

                        <p>
                            {listing.description}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Booking mode
                        </p>

                        <p>
                            {listing.bookingMode}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Contact phone
                        </p>

                        <p>
                            {listing.contactPhone}
                        </p>
                    </div>

                    {listing.contactEmail && (
                        <div>
                            <p className="text-sm text-gray-500">
                                Contact email
                            </p>

                            <p>
                                {listing.contactEmail}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-gray-500">
                            Address
                        </p>

                        <p>
                            {listing.addressLine1}
                            {listing.addressLine2 &&
                                `, ${listing.addressLine2}`}
                        </p>

                        <p>
                            {listing.city},{" "}
                            {listing.state},{" "}
                            {listing.country}{" "}
                            {listing.postalCode}
                        </p>
                    </div>

                </div>
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/host/listings/${listing.listingId}/edit`,
                        )
                    }
                    className="
                bg-primary
                text-white
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                cursor-pointer
                "
                >
                    Update listing info
                </button>

                <button
                    onClick={() =>
                        navigate(`/host/listings/${listingId}/rooms/new`)
                    }
                    className="
                bg-primary
                text-white
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                cursor-pointer
                "
                >
                    Add Room
                </button>

            </section>



            {/* Images */}
            <section>

                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-lg font-bold">
                        Listing Images
                    </h2>

                    <span className="text-sm text-gray-500">
                        {listing.images?.length || 0} images
                    </span>

                </div>


                {/* Existing images */}
                {listing.images?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                        {listing.images.map((image) => (
                            <div
                                key={image.imageId}
                                className="
                                    relative
                                    rounded-2xl
                                    overflow-hidden
                                    border
                                    border-gray-200
                                "
                            >

                                <img
                                    src={image.imageUrl}
                                    alt={
                                        image.caption || listing.name
                                    }
                                    className="
                                        w-full
                                        h-45
                                        object-cover
                                    "
                                />

                                {image.isThumbnail && (
                                    <span className="
                                        absolute
                                        top-2
                                        left-2
                                        bg-primary
                                        text-white
                                        text-xs
                                        px-2
                                        py-1
                                        rounded-full
                                    ">
                                        Thumbnail
                                    </span>
                                )}

                                <div className="absolute bottom-2 right-2 flex gap-2">

                                    {!image.isThumbnail && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleMakeThumbnail(
                                                    image.imageId
                                                )
                                            }
                                            disabled={
                                                thumbnailImageId ===
                                                image.imageId
                                            }
                                            className="
                bg-primary
                text-white
                text-xs
                px-3
                py-1
                rounded-full
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
            "
                                        >
                                            {thumbnailImageId ===
                                                image.imageId
                                                ? "Updating..."
                                                : "Make Thumbnail"}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteImage(
                                                image.imageId
                                            )
                                        }
                                        disabled={
                                            deletingImageId ===
                                            image.imageId
                                        }
                                        className="
            bg-red-500
            text-white
            text-xs
            px-3
            py-1
            rounded-full
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
        "
                                    >
                                        {deletingImageId === image.imageId
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                ) : (
                    <p className="text-gray-500">
                        No listing images uploaded yet.
                    </p>
                )}


                {/* Upload */}
                <div className="
                    mt-6
                    border
                    border-gray-200
                    rounded-2xl
                    p-5
                    flex
                    flex-col
                    gap-y-4
                ">

                    <h3 className="font-semibold">
                        Add Image
                    </h3>

                    <input
                        id="listing-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setSelectedFile(
                                e.target.files?.[0] ||
                                null
                            )
                        }
                    />

                    <input
                        type="text"
                        value={caption}
                        onChange={(e) =>
                            setCaption(
                                e.target.value
                            )
                        }
                        placeholder="Caption (optional)"
                        className="input-field"
                    />

                    {imageError && (
                        <p className="text-sm text-red-500">
                            {imageError}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={
                            isUploading ||
                            !selectedFile
                        }
                        className="
                            w-full
                            md:w-max
                            md:px-8
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
                        {isUploading
                            ? "Uploading..."
                            : "Upload Image"}
                    </button>

                </div>

            </section>

            {/* Rooms */}
            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    Rooms
                </h2>

                {roomsLoading && (
                    <p>Loading rooms...</p>
                )}

                {roomsError && (
                    <p className="text-red-500">
                        {roomsError}
                    </p>
                )}

                {!roomsLoading &&
                    !roomsError &&
                    rooms.length === 0 && (
                        <p className="text-gray-500">
                            No rooms are currently available.
                        </p>
                    )}

                {!roomsLoading &&
                    !roomsError &&
                    rooms.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {rooms.map((room) => (
                                <RoomCard
                                    key={room.roomId}
                                    room={room}
                                    link={`/host/rooms/${room.roomId}`}
                                    listingId={listingId}
                                />
                            ))}
                        </div>
                    )}
            </section>

        </div >
    );
};