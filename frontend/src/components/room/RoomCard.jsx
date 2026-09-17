import { Link } from "react-router";
import { RoomImageSlider } from "./RoomImageSlider.jsx";

export const RoomCard = ({ room, link }) => {
    return (
        <article
            className="
                w-[240px] overflow-hidden
                rounded-xl border border-border
                bg-white
                transition hover:shadow-md
                sm:w-[280px]
            "
        >
            {/* Room Image */}
            <RoomImageSlider
                images={room.images}
                roomName={room.name}
                link={link}
            />

            {/* Room Details */}
            <Link
                to={link}
                className="block p-3 sm:p-4"
            >
                <h3 className="truncate text-sm font-semibold text-text sm:text-base">
                    {room.name}
                </h3>

                <p className="mt-0.5 text-xs text-text-muted sm:text-sm">
                    {room.roomType}
                </p>

                <p className="mt-2 text-xs text-text sm:text-sm">
                    {room.maxGuests}{" "}
                    {room.maxGuests === 1
                        ? "guest"
                        : "guests"}{" "}
                    · {room.beds}{" "}
                    {room.beds === 1
                        ? "bed"
                        : "beds"}

                    {room.bedrooms != null && (
                        <>
                            {" · "}
                            {room.bedrooms}{" "}
                            {room.bedrooms === 1
                                ? "bedroom"
                                : "bedrooms"}
                        </>
                    )}
                </p>

                <p className="mt-2 text-sm font-semibold text-text sm:mt-3 sm:text-base">
                    ₹{room.basePrice}
                    <span className="ml-1 text-xs font-normal text-text-muted sm:text-sm">
                        / night
                    </span>
                </p>
            </Link>
        </article>
    );
};