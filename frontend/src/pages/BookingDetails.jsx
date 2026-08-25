import { useEffect, useState } from "react";
import {
    FaChevronLeft,
    FaCheckCircle,
    FaCalendarAlt,
    FaUser,
    FaCreditCard,
} from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";
import { getBookingById } from "../apis/bookingApi.js";


export const BookingDetails = () => {
    const { bookingId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const {
        isAuthenticated,
        getAccessTokenSilently,
    } = useHoteruAuth();


    const [booking, setBooking] = useState(
        state?.booking || null
    );

    const [loading, setLoading] = useState(
        !state?.booking
    );

    const [error, setError] = useState(null);


    /*
     * Fetch booking only when it wasn't supplied
     * through navigation state.
     */
    useEffect(() => {

        if (booking) {
            return;
        }

        const controller =
            new AbortController();

        const fetchBooking = async () => {

            try {

                setLoading(true);
                setError(null);

                if (!isAuthenticated) {
                    setError(
                        "Please log in to view this booking."
                    );

                    return;
                }

                const token =
                    await getAccessTokenSilently();


                const response =
                    await getBookingById(
                        bookingId,
                        token,
                        controller.signal
                    );

                setBooking(response.data);

            } catch (err) {

                if (
                    err.name === "AbortError" ||
                    controller.signal.aborted
                ) {
                    return;
                }

                console.error(
                    "Failed to fetch booking:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load booking details."
                );

            } finally {

                if (!controller.signal.aborted) {
                    setLoading(false);
                }

            }
        };

        fetchBooking();

        return () => {
            controller.abort();
        };

    }, [
        bookingId,
        booking,
        isAuthenticated,
        getAccessTokenSilently,
    ]);


    /*
     * Loading
     */
    if (loading) {

        return (
            <div className="
                max-md:p-3
                md:p-5
                lg:px-15
                xl:px-20
            ">
                Loading booking details...
            </div>
        );

    }


    /*
     * Error / booking not found
     */
    if (!booking) {

        return (
            <div className="
                max-md:p-3
                md:p-5
                lg:px-15
                xl:px-20
            ">

                <Link
                    to="/accommodations"
                    className="
                        flex
                        items-center
                        w-max
                        gap-x-1
                        text-gray-500
                        hover:underline
                    "
                >
                    <FaChevronLeft size={10} />
                    Back to accommodations
                </Link>


                <div className="mt-8">

                    <h3 className="
                        text-xl
                        font-bold
                    ">
                        Booking not found
                    </h3>


                    <p className="
                        text-gray-500
                        mt-2
                    ">
                        {error ||
                            "We couldn't find this booking."}
                    </p>


                    <button
                        onClick={() =>
                            navigate("/accommodations")
                        }
                        className="
                            mt-5
                            bg-primary
                            text-white
                            rounded-full
                            px-5
                            py-2
                            font-semibold
                            cursor-pointer
                        "
                    >
                        Browse accommodations
                    </button>

                </div>

            </div>
        );

    }


    /*
     * Booking values
     */
    const checkIn =
        new Date(booking.checkIn);

    const checkOut =
        new Date(booking.checkOut);


    const nights = Math.max(
        1,
        Math.ceil(
            (
                checkOut.getTime() -
                checkIn.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        )
    );


    const pricePerNight =
        Number(booking.pricePerNight);

    const totalPrice =
        Number(booking.totalPrice);

    const paidAmount =
        Number(booking.paidAmount || 0);

    const remainingAmount =
        Number(booking.remainingAmount || 0);


    const isPaid =
        booking.paymentStatus === "PAID";


    const isCancelled =
        booking.status === "CANCELLED";


    return (

        <div className="
            max-md:p-3
            md:p-5
            lg:px-15
            xl:px-20
        ">

            {/* Back */}
            <Link
                to="/accommodations"
                className="
                    flex
                    items-center
                    w-max
                    gap-x-1
                    text-gray-500
                    hover:underline
                "
            >
                <FaChevronLeft size={10} />
                Accommodations
            </Link>


            {/* Header */}
            <div className="
                flex
                max-md:flex-col
                md:items-center
                md:justify-between
                gap-3
                my-5
            ">

                <div>

                    <h1 className="
                        text-2xl
                        font-bold
                    ">
                        Booking Details
                    </h1>


                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        Booking reference:{" "}
                        <span className="font-medium">
                            {booking.bookingReference}
                        </span>
                    </p>

                </div>


                {/* Status */}
                <span className={`
                    w-max
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold

                    ${isCancelled
                        ? "bg-red-100 text-red-700"
                        : isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                    }
                `}>

                    {isCancelled
                        ? "Cancelled"
                        : booking.status}

                </span>

            </div>


            {/* Main layout */}
            <div className="
                flex
                max-lg:flex-col
                gap-5
            ">


                {/* Left */}
                <section className="
                    lg:w-3/5
                    flex
                    flex-col
                    gap-5
                ">


                    {/* Property */}
                    <div className="
                        bg-base-100
                        rounded-2xl
                        overflow-hidden
                        shadow-sm
                        lg:shadow-lg
                    ">

                        <div className="
                            flex
                            max-md:flex-col
                        ">

                            <img
                                src={
                                    booking.thumbnailUrl ||
                                    "/room1.jpg"
                                }
                                alt={booking.roomName}
                                className="
                                    w-full
                                    md:w-2/5
                                    h-55
                                    md:h-auto
                                    object-cover
                                "
                            />


                            <div className="
                                p-5
                                flex
                                flex-col
                                justify-center
                                gap-2
                            ">

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">
                                    {booking.listingName}
                                </p>


                                <h2 className="
                                    text-xl
                                    font-bold
                                ">
                                    {booking.roomName}
                                </h2>


                                <p className="
                                    text-sm
                                    text-gray-500
                                ">
                                    ₹{pricePerNight}
                                    {" "}/ night
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Trip */}
                    <div className="
                        bg-base-100
                        rounded-2xl
                        p-5
                        shadow-sm
                        lg:shadow-lg
                    ">

                        <h2 className="
                            text-lg
                            font-bold
                            mb-4
                        ">
                            Your Trip
                        </h2>


                        <div className="
                            grid
                            md:grid-cols-2
                            gap-3
                        ">

                            {/* Check in */}
                            <div className="
                                bg-base-300
                                rounded-xl
                                p-4
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-gray-500
                                    text-sm
                                ">
                                    <FaCalendarAlt />

                                    <span>
                                        Check-in
                                    </span>
                                </div>


                                <p className="
                                    font-semibold
                                    mt-2
                                ">
                                    {checkIn.toLocaleDateString()}
                                </p>

                            </div>


                            {/* Check out */}
                            <div className="
                                bg-base-300
                                rounded-xl
                                p-4
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-gray-500
                                    text-sm
                                ">
                                    <FaCalendarAlt />

                                    <span>
                                        Check-out
                                    </span>
                                </div>


                                <p className="
                                    font-semibold
                                    mt-2
                                ">
                                    {checkOut.toLocaleDateString()}
                                </p>

                            </div>


                            {/* Guests */}
                            <div className="
                                bg-base-300
                                rounded-xl
                                p-4
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-gray-500
                                    text-sm
                                ">
                                    <FaUser />

                                    <span>
                                        Guests
                                    </span>
                                </div>


                                <p className="
                                    font-semibold
                                    mt-2
                                ">
                                    {booking.guests}{" "}
                                    {booking.guests === 1
                                        ? "guest"
                                        : "guests"}
                                </p>

                            </div>


                            {/* Nights */}
                            <div className="
                                bg-base-300
                                rounded-xl
                                p-4
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    text-gray-500
                                    text-sm
                                ">
                                    <FaCalendarAlt />

                                    <span>
                                        Duration
                                    </span>
                                </div>


                                <p className="
                                    font-semibold
                                    mt-2
                                ">
                                    {nights}{" "}
                                    {nights === 1
                                        ? "night"
                                        : "nights"}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Payment information */}
                    <div className="
                        bg-base-100
                        rounded-2xl
                        p-5
                        shadow-sm
                        lg:shadow-lg
                    ">

                        <div className="
                            flex
                            items-center
                            gap-2
                            mb-4
                        ">

                            <FaCreditCard />

                            <h2 className="text-lg font-bold">
                                Payment Information
                            </h2>

                        </div>


                        <div className="flex flex-col gap-3 text-sm">

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Payment option
                                </span>

                                <span className="font-medium">
                                    {booking.paymentOption}
                                </span>
                            </div>


                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Payment status
                                </span>

                                <span className="font-medium">
                                    {booking.paymentStatus}
                                </span>
                            </div>


                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Paid amount
                                </span>

                                <span>₹{paidAmount}</span>
                            </div>

                            {Number(remainingAmount) > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Remaining amount
                                    </span>

                                    <span>
                                        ₹{Number(remainingAmount).toFixed(2)}
                                    </span>
                                </div>
                            )}

                        </div>

                    </div>

                </section>


                {/* Right - Price */}
                <section className="lg:w-2/5">

                    <div className="bg-base-100 rounded-2xl p-5 shadow-sm lg:shadow-lg lg:sticky lg:top-5">

                        <h2 className="
                            text-lg
                            font-bold
                            mb-4
                        ">
                            Price Details
                        </h2>


                        <div className="flex flex-col gap-3 text-sm">

                            <div className="flex justify-between text-gray-600">

                                <span>
                                    ₹{pricePerNight} ×{" "}
                                    {nights} nights
                                </span>

                                <span>
                                    ₹{pricePerNight * nights}
                                </span>

                            </div>


                            <div className="border-b border-gray-400" />


                            <div className="flex justify-between font-bold text-base">

                                <span>Total</span>

                                <span>₹{totalPrice}</span>

                            </div>


                            <div className="border-b border-gray-300" />


                            <div className="flex justify-between">

                                <span>Paid</span>

                                <span>₹{paidAmount}</span>

                            </div>

                            {Number(remainingAmount) > 0 &&
                                <div className="flex justify-between font-semibold">

                                    <span>Remaining</span>

                                    <span>₹{Number(remainingAmount)}</span>

                                </div>
                            }

                        </div>


                        {/* Successful payment */}
                        {isPaid && (

                            <div className="mt-5 bg-green-100 text-green-700 rounded-xl
                                p-4 flex items-start gap-3"
                            >

                                <FaCheckCircle className="mt-1 shrink-0" />

                                <div>

                                    <p className="font-semibold">
                                        Payment completed
                                    </p>

                                    <p className="text-sm mt-1">
                                        Your booking has been
                                        successfully paid.
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* Remaining payment */}
                        {!isCancelled &&
                            remainingAmount > 0 && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/payments/${booking.bookingId}`,
                                            {
                                                state: {
                                                    booking,
                                                },
                                            }
                                        )
                                    }
                                    className="
                                    mt-5
                                    w-full
                                    bg-primary
                                    hover:bg-primary/80
                                    text-white
                                    rounded-full
                                    py-3
                                    font-semibold
                                    cursor-pointer
                                "
                                >
                                    Pay ₹{remainingAmount}
                                </button>

                            )}

                    </div>

                </section>

            </div>

        </div>
    );
};