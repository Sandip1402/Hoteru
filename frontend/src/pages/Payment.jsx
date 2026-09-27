import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import {
    Link,
    useLocation,
    useNavigate,
    useParams,
} from "react-router";

import { RoomCardFlat, PriceDetails } from "../components";
import { useHoteruAuth } from "../auth/HoteruAuthProvider.jsx";

import { useBookingService } from "../hooks/useBookingService.js";
import { usePaymentService } from "../hooks/usePaymentService.js";

import { loadRazorpay } from "../utils/razorpay.js";

export const Payment = () => {
    const { bookingId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const { getBookingById, updateBooking } = useBookingService();

    const {
        createPaymentOrder,
        verifyPayment,
        cancelPayment,
    } = usePaymentService();

    const { isAuthenticated } = useHoteruAuth();

    const [booking, setBooking] = useState(
        state?.booking || null
    );

    const [loading, setLoading] = useState(
        !state?.booking
    );

    const [paymentState, setPaymentState] =
        useState("IDLE");
    // IDLE | PROCESSING | SUCCESS | FAILED | CANCELLED

    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState(null);

    /*
     * Editable booking values
     */
    const [checkIn, setCheckIn] = useState(state?.booking?.checkIn?.slice(0, 10) || "");

    const [checkOut, setCheckOut] = useState(state?.booking?.checkOut?.slice(0, 10) || "");

    const [guests, setGuests] = useState(state?.booking?.guests?.toString() || "1");

    /*
     * Original values are used to determine
     * whether the booking has been modified.
     */
    const [originalDetails, setOriginalDetails] =
        useState({
            checkIn:
                state?.booking?.checkIn?.slice(0, 10) || "",

            checkOut:
                state?.booking?.checkOut?.slice(0, 10) || "",

            guests:
                state?.booking?.guests?.toString() || "1",
        });

    /*
     * Fetch booking only when it wasn't passed
     * through navigation state.
     */
    useEffect(() => {
        if (booking) return;

        const controller = new AbortController();

        const fetchBooking = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getBookingById(
                    bookingId,
                    controller.signal
                );

                const fetchedBooking = response.data;

                setBooking(fetchedBooking);

                const fetchedCheckIn = fetchedBooking.checkIn?.slice(0, 10) || "";

                const fetchedCheckOut = fetchedBooking.checkOut?.slice(0, 10) || "";

                const fetchedGuests = fetchedBooking.guests?.toString() || "1";

                setCheckIn(fetchedCheckIn);
                setCheckOut(fetchedCheckOut);
                setGuests(fetchedGuests);

                setOriginalDetails({
                    checkIn: fetchedCheckIn,
                    checkOut: fetchedCheckOut,
                    guests: fetchedGuests,
                });
            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                }

                console.error(
                    "Failed to fetch booking:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load booking information."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchBooking();

        return () => controller.abort();
    }, [bookingId, booking]);

    /*
     * Check whether the user changed
     * the booking details.
     */
    const hasChanges =
        checkIn !== originalDetails.checkIn ||
        checkOut !== originalDetails.checkOut ||
        String(guests) !== originalDetails.guests;

    /*
     * Loading
     */
    if (loading) {
        return (
            <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <p className="text-sm text-text-muted">
                    Loading booking details...
                </p>
            </div>
        );
    }

    /*
     * Booking not found
     */
    if (!booking) {
        return (
            <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <h3 className="text-xl font-semibold text-text">
                    Booking information not found
                </h3>

                <p className="mt-2 text-sm text-text-muted">
                    Please go back and create your booking
                    again.
                </p>

                <button
                    type="button"
                    onClick={() =>navigate(-1)}
                    className="
                        mt-5 rounded-lg
                        bg-primary px-5 py-2.5
                        text-sm font-semibold text-white
                        transition hover:bg-primary-dark
                    "
                >
                    Back
                </button>
            </div>
        );
    }

    /*
     * Payment status
     */
    const isPaid =
        booking.paymentStatus === "PAID";

    const isProcessing =
        paymentState === "PROCESSING";

    /*
     * Determine what this payment is for.
     *
     * PENDING
     *   → initial booking payment
     *
     * PARTIALLY_PAID
     *   → remaining payment
     */
    const paymentPurpose =
        booking.paymentStatus === "PENDING"
            ? "BOOKING"
            : "REMAINING";

    /*
     * Determine amount for the current booking.
     */
    const payableAmount =
        paymentPurpose === "BOOKING"
            ? booking.paymentOption === "PAY_NOW"
                ? Number(booking.totalPrice)
                : Number(booking.bookingAmount)
            : Number(booking.remainingAmount);

    /*
     * Update booking
     *
     * This is called BEFORE payment when the user
     * changes dates or guests.
     */
    const handleUpdateBooking = async () => {
        const guestCount = Number(guests);

        /*
         * Date validation
         */
        if (!checkIn || !checkOut) {
            setError(
                "Please select check-in and check-out dates."
            );
            return;
        }

        if (
            new Date(checkOut) <=
            new Date(checkIn)
        ) {
            setError(
                "Check-out must be after check-in."
            );
            return;
        }

        /*
         * Guest validation
         */
        if (
            !Number.isInteger(guestCount) ||
            guestCount < 1 ||
            guestCount > booking.maxGuests
        ) {
            setError(
                `Guests must be between 1 and ${booking.maxGuests}.`
            );
            return;
        }

        try {
            setUpdating(true);
            setError(null);

            const response = await updateBooking(
                booking.bookingId,
                {
                    checkIn,
                    checkOut,
                    guests: guestCount,
                }
            );

            const updatedBooking = response.data;

            /*
             * Update booking displayed throughout
             * the payment page.
             */
            setBooking(updatedBooking);

            /*
             * Update the original values so the
             * "Update trip" button disappears.
             */
            setOriginalDetails({
                checkIn:
                    updatedBooking.checkIn?.slice(0, 10) ||
                    checkIn,

                checkOut:
                    updatedBooking.checkOut?.slice(0, 10) ||
                    checkOut,

                guests:
                    updatedBooking.guests?.toString() ||
                    String(guestCount),
            });

            /*
             * Keep inputs synchronized with the
             * backend response.
             */
            setCheckIn(
                updatedBooking.checkIn?.slice(0, 10) ||
                checkIn
            );

            setCheckOut(
                updatedBooking.checkOut?.slice(0, 10) ||
                checkOut
            );

            setGuests(
                updatedBooking.guests?.toString() ||
                String(guestCount)
            );
        } catch (err) {
            console.error(
                "Failed to update booking:",
                err
            );

            setError(
                err.message ||
                "Unable to update booking."
            );
        } finally {
            setUpdating(false);
        }
    };

    /*
     * Start Razorpay payment
     *
     * Booking should already be updated before
     * reaching this function.
     */
    const handlePayment = async () => {
        if (!isAuthenticated) {
            setError(
                "Please log in to continue."
            );
            return;
        }

        if (hasChanges) {
            setError(
                "Please update your trip details before paying."
            );
            return;
        }

        if (isPaid) {
            setError(
                "This booking has already been fully paid."
            );
            return;
        }

        if (
            !payableAmount ||
            payableAmount <= 0
        ) {
            setError(
                "There is no payment amount for this booking."
            );
            return;
        }

        try {
            setPaymentState("PROCESSING");
            setError(null);

            /*
             * Load Razorpay Checkout
             */
            await loadRazorpay();

            /*
             * Create Razorpay order using the
             * already-updated booking.
             */
            const orderResponse =
                await createPaymentOrder(
                    booking.bookingId,
                    paymentPurpose
                );

            const payment =
                orderResponse.data;

            const options = {
                key: payment.keyId,

                amount:
                    Number(payment.amount) * 100,

                currency:
                    payment.currency,

                name: "Hoteru",

                description:
                    paymentPurpose === "BOOKING"
                        ? `Booking ${booking.bookingReference}`
                        : `Remaining payment for ${booking.bookingReference}`,

                order_id:
                    payment.orderId,

                handler: async (
                    razorpayResponse
                ) => {
                    try {
                        setError(null);

                        /*
                         * Verify payment on backend
                         */
                        const verifyResponse =
                            await verifyPayment({
                                paymentId:
                                    payment.paymentId,

                                gatewayOrderId:
                                    razorpayResponse
                                        .razorpay_order_id,

                                gatewayPaymentId:
                                    razorpayResponse
                                        .razorpay_payment_id,

                                gatewaySignature:
                                    razorpayResponse
                                        .razorpay_signature,
                            });

                        console.log("Payment verified:", verifyResponse);

                        /*
                         * Backend already returns
                         * the updated booking.
                         */
                        const updatedBooking =
                            verifyResponse?.data?.booking;

                        if (updatedBooking) {
                            setBooking(
                                updatedBooking
                            );
                        }

                        setPaymentState(
                            "SUCCESS"
                        );

                        /*
                         * Redirect to BookingDetails
                         */
                        setTimeout(() => {
                            navigate(
                                `/bookings/${booking.bookingId}`,
                                {
                                    replace: true,
                                    state: {
                                        booking:
                                            updatedBooking ||
                                            booking,
                                    },
                                }
                            );
                        }, 1500);
                    } catch (err) {
                        console.error(
                            "Payment verification failed:",
                            err
                        );

                        setError(
                            err.message ||
                            "Payment verification failed."
                        );

                        setPaymentState(
                            "FAILED"
                        );
                    }
                },

                /*
                 * User closes Razorpay checkout
                 */
                modal: {
                    ondismiss:
                        async () => {
                            try {
                                await cancelPayment(
                                    payment.paymentId
                                );

                                setPaymentState(
                                    "CANCELLED"
                                );
                            } catch (err) {
                                console.error(
                                    "Failed to cancel payment:",
                                    err
                                );

                                setError(
                                    err.message ||
                                    "Failed to cancel payment."
                                );

                                setPaymentState(
                                    "FAILED"
                                );
                            }
                        },
                },
            };

            const razorpay =
                new window.Razorpay(options);

            /*
             * Razorpay payment failed
             */
            razorpay.on(
                "payment.failed",
                (response) => {
                    console.error(
                        "Razorpay payment failed:",
                        response
                    );

                    setError(
                        response.error
                            ?.description ||
                        "Payment failed. Please try again."
                    );

                    setPaymentState(
                        "FAILED"
                    );
                }
            );

            razorpay.open();
        } catch (err) {
            console.error(
                "Unable to start payment:",
                err
            );

            setError(
                err.message ||
                "Unable to start payment."
            );

            setPaymentState(
                "FAILED"
            );
        }
    };

    /*
     * Retry payment
     */
    const handleRetry = () => {
        setError(null);
        setPaymentState("IDLE");
        handlePayment();
    };

    return (
        <main className="min-h-screen bg-white">
            <div className="
                mx-auto w-full max-w-[1320px]
                px-4 py-6
                sm:px-6
                lg:px-8 lg:py-8
            ">

                {/* Back */}
                <Link
                    to={`/accommodations/${booking.listingId}/rooms/${booking.roomId}`}
                    className="
                        mb-5 inline-flex items-center gap-2
                        text-sm font-medium
                        text-text-muted
                        transition hover:text-text
                    "
                >
                    <FaChevronLeft size={11} />
                    Back to room
                </Link>

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="
                        text-2xl font-semibold text-text
                        sm:text-3xl
                    ">
                        Confirm and pay
                    </h1>

                    <p className="
                        mt-2 text-sm text-text-muted
                        sm:text-base
                    ">
                        Review your trip details and
                        complete your payment.
                    </p>
                </div>

                {/* Main layout */}
                <div className="
                    grid
                    min-w-0
                    gap-8
                    lg:grid-cols-[minmax(0,1fr)_420px]
                ">

                    {/* LEFT */}
                    <div className="
                        min-w-0 space-y-8
                    ">

                        {/* Your trip */}
                        <section>
                            <div className="mb-4">
                                <h2 className="
                                    text-xl font-semibold
                                    text-text
                                ">
                                    Your trip
                                </h2>

                                <p className="
                                    mt-1 text-sm
                                    text-text-muted
                                ">
                                    Review your stay details
                                    before paying.
                                </p>
                            </div>

                            <div className="
                                min-w-0
                                rounded-2xl
                                border border-border
                                bg-white
                                p-5 sm:p-6
                            ">

                                {/* Dates */}
                                <div>
                                    <p className="
                                        mb-3 text-sm
                                        font-semibold text-text
                                    ">
                                        Dates
                                    </p>

                                    <div className="
                                        grid min-w-0
                                        grid-cols-1 gap-4
                                        sm:grid-cols-2
                                    ">

                                        {/* Check-in */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="paymentCheckIn"
                                                className="
                                                    mb-2 block
                                                    text-xs
                                                    font-medium
                                                    text-text-muted
                                                "
                                            >
                                                Check-in
                                            </label>

                                            <input
                                                id="paymentCheckIn"
                                                type="date"
                                                value={checkIn}
                                                onChange={(e) =>
                                                    setCheckIn(
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                    block
                                                    w-full
                                                    min-w-0
                                                    max-w-full
                                                    rounded-lg
                                                    border
                                                    border-border
                                                    bg-white
                                                    px-3 py-2.5
                                                    text-sm
                                                    text-text
                                                    outline-none
                                                    transition
                                                    focus:border-primary
                                                    focus:ring-2
                                                    focus:ring-primary/10
                                                "
                                            />
                                        </div>

                                        {/* Check-out */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="paymentCheckOut"
                                                className="
                                                    mb-2 block
                                                    text-xs
                                                    font-medium
                                                    text-text-muted
                                                "
                                            >
                                                Check-out
                                            </label>

                                            <input
                                                id="paymentCheckOut"
                                                type="date"
                                                value={checkOut}
                                                onChange={(e) =>
                                                    setCheckOut(
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                    block
                                                    w-full
                                                    min-w-0
                                                    max-w-full
                                                    rounded-lg
                                                    border
                                                    border-border
                                                    bg-white
                                                    px-3 py-2.5
                                                    text-sm
                                                    text-text
                                                    outline-none
                                                    transition
                                                    focus:border-primary
                                                    focus:ring-2
                                                    focus:ring-primary/10
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Guests */}
                                <div className="
                                    mt-5
                                    border-t border-border
                                    pt-5
                                ">
                                    <label
                                        htmlFor="paymentGuests"
                                        className="
                                            mb-2 block
                                            text-sm
                                            font-semibold
                                            text-text
                                        "
                                    >
                                        Guests
                                    </label>

                                    <input
                                        id="paymentGuests"
                                        type="number"
                                        min="1"
                                        max={booking.maxGuests}
                                        value={guests}
                                        onChange={(e) =>
                                            setGuests(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            block
                                            w-full
                                            min-w-0
                                            max-w-full
                                            rounded-lg
                                            border
                                            border-border
                                            bg-white
                                            px-3 py-2.5
                                            text-sm
                                            text-text
                                            outline-none
                                            transition
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/10
                                            sm:max-w-[220px]
                                        "
                                    />
                                </div>

                                {/* Update button */}
                                {hasChanges && (
                                    <div className="
                                        mt-5
                                        border-t border-border
                                        pt-5
                                    ">
                                        <button
                                            type="button"
                                            onClick={
                                                handleUpdateBooking
                                            }
                                            disabled={updating}
                                            className="
                                                w-full
                                                rounded-lg
                                                bg-primary
                                                px-5 py-2.5
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-primary-dark
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                                sm:w-auto
                                            "
                                        >
                                            {updating
                                                ? "Updating..."
                                                : "Update trip"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Payment breakdown */}
                        <section>
                            <div className="mb-4">
                                <h2 className="
                                    text-xl font-semibold
                                    text-text
                                ">
                                    Payment
                                </h2>

                                <p className="
                                    mt-1 text-sm
                                    text-text-muted
                                ">
                                    Review the amount you will
                                    pay now.
                                </p>
                            </div>

                            <div className="
                                rounded-2xl
                                border border-border
                                bg-white
                                p-5 sm:p-6
                            ">

                                {/* Total */}
                                <div className="
                                    flex items-center
                                    justify-between gap-4
                                    text-sm
                                ">
                                    <span className="
                                        text-text-muted
                                    ">
                                        Total price
                                    </span>

                                    <span className="
                                        shrink-0
                                        font-medium text-text
                                    ">
                                        ₹
                                        {Number(
                                            booking.totalPrice
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                {/* Already paid */}
                                <div className="
                                    mt-4 flex items-center
                                    justify-between gap-4
                                    text-sm
                                ">
                                    <span className="
                                        text-text-muted
                                    ">
                                        Already paid
                                    </span>

                                    <span className="
                                        shrink-0
                                        font-medium text-text
                                    ">
                                        ₹
                                        {Number(
                                            booking.paidAmount
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="
                                    my-5 border-t border-border
                                " />

                                {/* Amount to pay */}
                                <div className="
                                    flex items-center
                                    justify-between gap-4
                                ">
                                    <span className="
                                        font-semibold text-text
                                    ">
                                        Amount to pay
                                    </span>

                                    <span className="
                                        shrink-0
                                        text-xl font-semibold
                                        text-text
                                    ">
                                        ₹
                                        {payableAmount.toFixed(2)}
                                    </span>
                                </div>

                                {/* Payment type */}
                                <p className="
                                    mt-2 text-xs
                                    text-text-muted
                                ">
                                    {paymentPurpose ===
                                    "BOOKING"
                                        ? booking.paymentOption ===
                                          "PAY_NOW"
                                            ? "Full payment"
                                            : "Booking payment"
                                        : "Remaining payment"}
                                </p>
                            </div>
                        </section>

                        {/* Error */}
                        {error && (
                            <div className="
                                rounded-xl
                                border border-red-200
                                bg-red-50
                                px-4 py-3
                            ">
                                <p className="
                                    text-sm text-red-600
                                ">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Success */}
                        {paymentState ===
                            "SUCCESS" && (
                            <div className="
                                rounded-xl
                                border border-green-200
                                bg-green-50
                                p-5
                            ">
                                <h3 className="
                                    text-lg font-semibold
                                    text-green-800
                                ">
                                    Payment successful
                                </h3>

                                <p className="
                                    mt-1 text-sm
                                    text-green-700
                                ">
                                    Your booking has been
                                    successfully processed.
                                </p>

                                <p className="
                                    mt-2 text-xs
                                    text-green-700
                                ">
                                    Redirecting to your
                                    booking...
                                </p>
                            </div>
                        )}

                        {/* Failed */}
                        {paymentState ===
                            "FAILED" && (
                            <div className="
                                rounded-xl
                                border border-red-200
                                bg-red-50
                                p-5
                            ">
                                <p className="
                                    text-sm text-red-600
                                ">
                                    Payment failed.
                                    Please try again.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleRetry
                                    }
                                    className="
                                        mt-4 w-full
                                        rounded-lg
                                        border border-primary
                                        px-4 py-2.5
                                        text-sm font-semibold
                                        text-primary
                                        transition
                                        hover:bg-primary
                                        hover:text-white
                                        sm:w-auto
                                    "
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Cancelled */}
                        {paymentState ===
                            "CANCELLED" && (
                            <div className="
                                rounded-xl
                                border border-border
                                bg-surface
                                p-5
                            ">
                                <p className="
                                    text-sm text-text-muted
                                ">
                                    Payment was cancelled.
                                    Your booking has not
                                    been paid.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleRetry
                                    }
                                    className="
                                        mt-4 w-full
                                        rounded-lg
                                        bg-primary
                                        px-5 py-2.5
                                        text-sm font-semibold
                                        text-white
                                        transition
                                        hover:bg-primary-dark
                                        sm:w-auto
                                    "
                                >
                                    Pay now
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — RESERVATION */}
                    <aside className="
                        min-w-0
                        lg:sticky lg:top-24
                        lg:self-start
                    ">
                        <section className="
                            min-w-0
                            w-full
                            overflow-hidden
                            rounded-2xl
                            border border-border
                            bg-white
                            shadow-sm
                        ">

                            {/* Room */}
                            <div className="
                                p-5 sm:p-6
                            ">
                                <h2 className="
                                    mb-4 text-lg
                                    font-semibold text-text
                                ">
                                    Your reservation
                                </h2>

                                <RoomCardFlat
                                    booking={booking}
                                />
                            </div>

                            <div className="
                                border-t border-border
                            " />

                            {/* Price summary */}
                            <div className="
                                p-5 sm:p-6
                            ">
                                <div className="mb-4">
                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-text
                                    ">
                                        Price details
                                    </p>
                                </div>

                                <PriceDetails
                                    booking={booking}
                                />
                            </div>

                            <div className="
                                border-t border-border
                            " />

                            {/* Pay */}
                            <div className="
                                p-5 sm:p-6
                            ">
                                {!isPaid &&
                                    paymentState !==
                                        "SUCCESS" &&
                                    paymentState !==
                                        "FAILED" &&
                                    paymentState !==
                                        "CANCELLED" && (
                                        <button
                                            type="button"
                                            onClick={
                                                handlePayment
                                            }
                                            disabled={
                                                isProcessing ||
                                                updating ||
                                                hasChanges
                                            }
                                            className="
                                                w-full
                                                rounded-lg
                                                bg-primary
                                                px-5 py-3
                                                text-sm
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-primary-dark
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            {hasChanges
                                                ? "Update trip to continue"
                                                : isProcessing
                                                    ? "Processing..."
                                                    : `Pay ₹${payableAmount.toFixed(
                                                        2
                                                    )}`}
                                        </button>
                                    )}

                                {isPaid && (
                                    <div className="
                                        w-full rounded-lg
                                        bg-green-50
                                        px-5 py-3
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-green-700
                                    ">
                                        Booking fully paid
                                    </div>
                                )}

                                <p className="
                                    mt-3 text-center
                                    text-xs text-text-light
                                ">
                                    Secure payment powered
                                    by Razorpay
                                </p>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
};