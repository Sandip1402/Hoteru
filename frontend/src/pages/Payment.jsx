import { useEffect, useState } from "react";
import { FaChevronLeft, FaPen } from "react-icons/fa";
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

    const { getBookingById } = useBookingService();
    const { createPaymentOrder, verifyPayment, cancelPayment } = usePaymentService();

    const { isAuthenticated } = useHoteruAuth();

    const [booking, setBooking] = useState(state?.booking || null);

    const [loading, setLoading] = useState(!state?.booking);

    const [paymentState, setPaymentState] = useState("IDLE");
    // IDLE | PROCESSING | SUCCESS | FAILED | CANCELLED

    const [error, setError] = useState(null);

    /*
     * Fetch booking only if it wasn't passed
     * through navigation state.
     */
    useEffect(() => {
        if (booking) return;

        const controller = new AbortController();

        const fetchBooking = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getBookingById(bookingId, controller.signal);

                setBooking(response.data);
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
    }, [
        bookingId,
        booking,
    ]);

    /*
     * Loading
     */
    if (loading) {
        return (
            <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">
                Loading booking details...
            </div>
        );
    }

    /*
     * Booking not found
     */
    if (!booking) {
        return (
            <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">
                <h3 className="text-xl my-5 font-bold">
                    Booking information not found
                </h3>

                <p className="text-gray-500">
                    Please go back and create your
                    booking again.
                </p>

                <button
                    onClick={() => navigate("/accommodations")}
                    className="mt-5 bg-primary text-white rounded-full
                        px-5 py-2 font-semibold"
                >
                    Browse accommodations
                </button>
            </div>
        );
    }

    /*
     * Payment status
     */
    const isPaid = booking.paymentStatus === "PAID";

    const isProcessing = paymentState === "PROCESSING";

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
     * Determine the amount for THIS payment.
     *
     * BOOKING + PAY_NOW
     *   → totalPrice
     *
     * BOOKING + BOOK_ONLY
     *   → bookingAmount
     *
     * REMAINING
     *   → remainingAmount
     */
    const payableAmount =
        paymentPurpose === "BOOKING"
            ? booking.paymentOption === "PAY_NOW"
                ? Number(booking.totalPrice)
                : Number(booking.bookingAmount)
            : Number(booking.remainingAmount);

    const handlePayment = async () => {
        if (!isAuthenticated) {
            setError(
                "Please log in to continue."
            );
            return;
        }

        if (isPaid) {
            setError("This booking has already been fully paid.");
            return;
        }

        if (!payableAmount || payableAmount <= 0) {
            setError("There is no payment amount for this booking.");
            return;
        }

        try {
            setPaymentState("PROCESSING");
            setError(null);

            /*
             * Load Razorpay Checkout
             */
            await loadRazorpay();

            const orderResponse = await createPaymentOrder(
                booking.bookingId,
                paymentPurpose,
            );

            const payment = orderResponse.data;

            const options = {
                key: payment.keyId,

                amount: Number(payment.amount) * 100,

                currency: payment.currency,

                name: "Hoteru",

                description:
                    paymentPurpose === "BOOKING"
                        ? `Booking ${booking.bookingReference}`
                        : `Remaining payment for ${booking.bookingReference}`,

                order_id: payment.orderId,

                handler: async (
                    razorpayResponse
                ) => {
                    try {
                        setError(null);

                        /*
                         * Verify payment on backend
                         */
                        const verifyResponse =
                            await verifyPayment(
                                {
                                    paymentId:
                                        payment.paymentId,

                                    gatewayOrderId:
                                        razorpayResponse.razorpay_order_id,

                                    gatewayPaymentId:
                                        razorpayResponse.razorpay_payment_id,

                                    gatewaySignature:
                                        razorpayResponse.razorpay_signature,
                                },
                                token
                            );

                        console.log("Payment verified:", verifyResponse);

                        /*
                         * Backend already returns
                         * the updated booking.
                         *
                         * No additional GET request.
                         */
                        const updatedBooking = verifyResponse?.data?.booking;

                        if (updatedBooking) {
                            setBooking(updatedBooking);
                        }

                        setPaymentState("SUCCESS");

                        /*
                         * Redirect to BookingDetails
                         * using the updated booking.
                         */
                        setTimeout(() => {
                            navigate(
                                `/bookings/${booking.bookingId}`,
                                {
                                    replace: true,
                                    state: {
                                        booking: updatedBooking || booking,
                                    },
                                }
                            );
                        }, 1500);

                    } catch (err) {
                        console.error("Payment verification failed:", err);

                        setError(
                            err.message || "Payment verification failed."
                        );

                        setPaymentState("FAILED");
                    }
                },

                /*
                 * User closes Razorpay checkout
                 */
                modal: {
                    ondismiss: async () => {
                        try {
                            await cancelPayment(payment.paymentId);
                            setPaymentState("CANCELLED");
                        } catch (err) {
                            console.error(
                                "Failed to cancel payment:", err
                            );

                            setError(
                                err.message || "Failed to cancel payment."
                            );

                            setPaymentState("FAILED");
                        }
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

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

                    setPaymentState("FAILED");
                }
            );

            razorpay.open();

        } catch (err) {
            console.error("Unable to start payment:", err);

            setError(err.message || "Unable to start payment.");

            setPaymentState("FAILED");
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
        <div className="max-md:p-3 md:p-5 lg:px-15 xl:px-20">

            {/* Back */}
            <Link
                to={`/accommodations/${booking.listingId}/rooms/${booking.roomId}`}
                className="flex items-center w-max gap-x-1 text-gray-500
                    cursor-pointer hover:underline"
            >
                <FaChevronLeft size={10} />
                Back
            </Link>

            <h3 className="text-xl my-5 font-bold">
                Confirm and Pay
            </h3>

            <div className="flex max-lg:flex-col max-lg:gap-y-5 lg:justify-between lg:flex-row-reverse">

                {/* =========================
                    Room + Price
                ========================== */}
                <section className="flex flex-col gap-y-2 rounded-box lg:shadow-lg
                    lg:w-1/2 lg:p-5"
                >

                    <RoomCardFlat booking={booking} />

                    <PriceDetails booking={booking} />

                </section>

                {/* =========================
                    Trip + Payment
                ========================== */}
                <section className="lg:flex lg:flex-col lg:gap-y-5 lg:w-9/20">

                    {/* Trip Details */}
                    <div className="flex flex-col gap-y-2">

                        <h3 className="text-lg max-lg:mt-2 font-bold">
                            Your Trip
                        </h3>

                        <div className="flex max-md:flex-col max-md:gap-y-2 md:gap-x-3
                            *:flex-1 *:flex-col *:bg-base-300 *:py-2 *:px-3
                            *:rounded-box **:last:flex **:last:justify-between"
                        >

                            {/* Dates */}
                            <span>
                                <label>Dates</label>

                                <span>
                                    <p className="text-gray-500">
                                        {new Date(booking.checkIn).toLocaleDateString()}
                                        {" "}-{" "}
                                        {new Date(booking.checkOut).toLocaleDateString()}
                                    </p>

                                    <FaPen />
                                </span>
                            </span>

                            {/* Guests */}
                            <span>
                                <label>Guests</label>

                                <span>
                                    <p className="text-gray-500">
                                        {booking.guests}
                                    </p>

                                    <FaPen />
                                </span>
                            </span>

                        </div>
                    </div>

                    {/* =========================
                        Payment
                    ========================== */}
                    <div className="flex flex-col gap-y-2">

                        <h3 className="text-lg max-lg:mt-2 font-bold">
                            Payment
                        </h3>

                        <div className="bg-base-300 rounded-box p-4">

                            {/* Total */}
                            <div className="flex justify-between">
                                <span>
                                    Total price
                                </span>

                                <span>
                                    ₹{Number(booking.totalPrice).toFixed(2)}
                                </span>
                            </div>

                            {/* Already Paid */}
                            <div className="flex justify-between mt-2">
                                <span>
                                    Already paid
                                </span>

                                <span>
                                    ₹{Number(booking.paidAmount).toFixed(2)}
                                </span>
                            </div>

                            {/* Amount to Pay */}
                            <div className="flex justify-between mt-2 font-semibold">
                                <span>
                                    Amount to pay
                                </span>

                                <span>
                                    ₹{payableAmount.toFixed(2)}
                                </span>
                            </div>

                            {/* Payment type */}
                            <div className="text-xs text-gray-500 mt-2">
                                {paymentPurpose === "BOOKING"
                                    ? booking.paymentOption ===
                                        "PAY_NOW"
                                        ? "Full payment"
                                        : "Booking payment"
                                    : "Remaining payment"}
                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-100 text-red-700 rounded-box p-3 text-sm">
                                {error}
                            </div>
                        )}

                        {/* =========================
                            Success
                        ========================== */}
                        {paymentState ===
                            "SUCCESS" && (
                                <div className="bg-green-100 text-green-800 rounded-box p-4 text-center">
                                    <h4 className="font-bold text-lg">
                                        Payment successful
                                    </h4>

                                    <p className="text-sm mt-1">
                                        {booking.paymentStatus ===
                                            "PARTIALLY_PAID"
                                            ? "Your booking has been secured. The remaining amount can be paid later."
                                            : "Your booking has been fully paid."}
                                    </p>

                                    <p className="text-xs mt-2 text-green-700">
                                        Redirecting to your
                                        booking...
                                    </p>
                                </div>
                            )}

                        {/* =========================
                            Failed
                        ========================== */}
                        {paymentState ===
                            "FAILED" && (
                                <div className="flex flex-col gap-y-2">
                                    <p className="text-sm text-red-500">
                                        Payment failed.
                                        Please try again.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleRetry}
                                        className="w-full border border-primary text-primary hover:bg-primary
                                        hover:text-white rounded-full py-2 font-semibold"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                        {/* =========================
                            Cancelled
                        ========================== */}
                        {paymentState ===
                            "CANCELLED" && (
                                <div className="flex flex-col gap-y-2">
                                    <p className="text-sm text-gray-500">
                                        Payment was cancelled.
                                        Your booking has not
                                        been paid.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleRetry}
                                        className="w-full border border-primary text-primary 
                                        hover:bg-primary hover:text-white rounded-full py-2 font-semibold"
                                    >
                                        Pay now
                                    </button>
                                </div>
                            )}

                        {/* =========================
                            Pay Button
                        ========================== */}
                        {!isPaid && paymentState !== "SUCCESS" &&
                            paymentState !== "FAILED" && paymentState !== "CANCELLED" &&
                            (
                                <button
                                    type="button"
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full bg-primary hover:bg-primary/80
                                        text-white rounded-full py-3 font-semibold
                                        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing
                                        ? "Processing..."
                                        : `Pay ₹${payableAmount.toFixed(2)}`}
                                </button>
                            )}

                        {/* Already paid */}
                        {isPaid && (
                            <div className="bg-green-100 text-green-700 rounded-full
                                py-3 text-center font-semibold">
                                Booking fully paid
                            </div>
                        )}

                    </div>
                </section>
            </div>
        </div>
    );
};