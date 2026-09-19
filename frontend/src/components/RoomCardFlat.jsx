import { useState } from "react";
import { FiHeart } from "react-icons/fi";

export const RoomCardFlat = ({ booking }) => {
    const [save, setSave] = useState(false);

    if (!booking) {
        return null;
    }

    return (
        <article className="flex gap-4">
            {/* Image */}
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-36">
                <img
                    src={
                        booking.thumbnailUrl ||
                        "/room1.jpg"
                    }
                    alt={booking.roomName}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-xs text-text-muted sm:text-sm">
                            {booking.listingName}
                        </p>

                        <h3 className="mt-1 truncate text-sm font-semibold text-text sm:text-base">
                            {booking.roomName}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSave((current) => !current)}
                        aria-label={
                            save
                                ? "Remove from saved"
                                : "Save room"
                        }
                        className="
                            shrink-0
                            rounded-full
                            p-1.5
                            text-text-muted
                            transition
                            hover:bg-surface
                            hover:text-text
                        "
                    >
                        <FiHeart
                            size={18}
                            strokeWidth={save ? 0 : 1.5}
                            fill={
                                save
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    </button>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-border" />

                {/* Price */}
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-text-muted sm:text-sm">
                        Room price
                    </span>

                    <span className="shrink-0 text-sm font-medium text-text">
                        ₹{Number(booking.pricePerNight).toFixed(2)}
                        <span className="ml-1 text-xs font-normal text-text-muted">
                            / night
                        </span>
                    </span>
                </div>
            </div>
        </article>
    );
};