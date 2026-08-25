import { useNavigate } from "react-router";
import { MapPin, Star } from "lucide-react";

const FALLBACK_IMAGE = "/Images/accommodation-placeholder.png";

export const ListingCard = ({ listing }) => {
    const navigate = useNavigate();

    const {
        listingId,
        name,
        type,
        city,
        state,
        country,
        thumbnailUrl,
        averageRating,
        reviewCount,
    } = listing;

    const location = [city, state, country]
        .filter(Boolean)
        .join(", ");

    const handleClick = () => {
        navigate(`/accommodations/${listingId}`);
    };

    return (
        <article
            onClick={handleClick}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={thumbnailUrl || FALLBACK_IMAGE}
                    alt={name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
            </div>

            <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-gray-900">
                        {name}
                    </h2>

                    {averageRating !== null && (
                        <span className="flex shrink-0 items-center gap-1 text-sm">
                            <Star size={14} fill="currentColor" />
                            {averageRating.toFixed(1)}
                        </span>
                    )}
                </div>

                {location && (
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        {location}
                    </p>
                )}

                <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-600">
                        {type?.toLowerCase()}
                    </span>

                    <span className="text-gray-500">
                        {reviewCount > 0
                            ? `${reviewCount} reviews`
                            : "No reviews yet"}
                    </span>
                </div>
            </div>
        </article>
    );
};