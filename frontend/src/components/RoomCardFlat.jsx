import { useState } from "react";
import { FiHeart } from "react-icons/fi";

export const RoomCardFlat = ({ booking }) => {
    const [save, setSave] = useState(false);

    if (!booking) return null;

    return (
        <article className="flex min-w-0 w-full gap-3 sm:gap-4">
            {/* Image */}
            <div className="
                h-24 w-24
                shrink-0
                overflow-hidden
                rounded-xl
                sm:h-32 sm:w-36
            ">
                <img
                    src={
                        booking.thumbnailUrl ||
                        "/room1.jpg"
                    }
                    alt={booking.roomName}
                    className="
                        h-full w-full
                        object-cover
                    "
                />
            </div>

            {/* Details */}
            <div className="
                min-w-0 flex-1
            ">
                {/* Header */}
                <div className="
                    flex min-w-0
                    items-start
                    justify-between
                    gap-2
                ">
                    <div className="min-w-0">
                        <p className="
                            truncate
                            text-xs
                            text-text-muted
                            sm:text-sm
                        ">
                            {booking.listingName}
                        </p>

                        <h3 className="
                            mt-1
                            truncate
                            text-sm
                            font-semibold
                            text-text
                            sm:text-base
                        ">
                            {booking.roomName}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSave((value) => !value)
                        }
                        aria-label={
                            save
                                ? "Remove from saved"
                                : "Save room"
                        }
                        className="
                            shrink-0
                            rounded-full
                            p-1
                            text-text-muted
                            transition
                            hover:bg-surface
                            hover:text-text
                        "
                    >
                        <FiHeart
                            size={17}
                            className={
                                save
                                    ? "fill-current"
                                    : ""
                            }
                        />
                    </button>
                </div>

                {/* Divider */}
                <div className="
                    my-2.5
                    border-t border-border
                    sm:my-3
                " />

                {/* Price */}
                <div className="
                    flex min-w-0
                    items-center
                    justify-between
                    gap-2
                ">
                    <span className="
                        shrink-0
                        text-xs
                        text-text-muted
                        sm:text-sm
                    ">
                        Room price
                    </span>

                    <span className="
                        min-w-0
                        truncate
                        text-right
                        text-sm
                        font-medium
                        text-text
                        sm:text-base
                    ">
                        ₹
                        {Number(
                            booking.pricePerNight
                        ).toFixed(2)}

                        <span className="
                            ml-1
                            text-xs
                            font-normal
                            text-text-muted
                        ">
                            / night
                        </span>
                    </span>
                </div>
            </div>
        </article>
    );
};