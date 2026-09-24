import { useNavigate } from "react-router";

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(price));
};

const getStatusClasses = (status) => {
    switch (status) {
        case "CONFIRMED":
            return "bg-green-100 text-green-700";
        case "AWAITING_PAYMENT":
            return "bg-yellow-100 text-yellow-700";
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        case "COMPLETED":
            return "bg-blue-100 text-blue-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export const BookingCard = ({ booking }) => {
    const navigate = useNavigate();

    return (
        <article className="overflow-hidden rounded-xl border border-border bg-white">
            {/* Image */}
            <div className="h-36 sm:h-48">
                {booking.thumbnailUrl ? (
                    <img
                        src={booking.thumbnailUrl}
                        alt={booking.listingName}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-surface text-sm text-text-light">
                        No image
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-text sm:text-lg">
                            {booking.listingName}
                        </h2>

                        <p className="mt-1 truncate text-sm text-text-muted">
                            {booking.roomName}
                        </p>
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            booking.status
                        )}`}
                    >
                        {booking.status.replaceAll("_", " ")}
                    </span>
                </div>

                {/* Stay information */}
                <div className="mt-4 flex gap-6 text-sm">
                    <div>
                        <p className="text-xs text-text-muted">
                            Stay
                        </p>

                        <p className="mt-1 font-medium text-text">
                            {formatDate(booking.checkIn)} –{" "}
                            {formatDate(booking.checkOut)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-text-muted">
                            Guests
                        </p>

                        <p className="mt-1 font-medium text-text">
                            {booking.guests}
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                    <div>
                        <p className="text-xs text-text-muted">
                            Total
                        </p>

                        <p className="mt-1 text-base font-semibold text-text sm:text-lg">
                            {formatPrice(booking.totalPrice)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/bookings/${booking.bookingId}`
                            )
                        }
                        className="rounded-lg border border-border px-3 py-2 text-sm font-medium
                         text-text transition hover:bg-surface sm:px-4"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </article>
    );
};