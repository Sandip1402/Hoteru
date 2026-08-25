import { useSearch } from "../context/SearchContext"
import { useNavigate } from "react-router";
import { DateInput } from "./DateInput.jsx";
import { Review } from "./RoomComponents.jsx";


export const PriceDetails = ({ booking }) => {

    if (!booking) {
        return null;
    }


    const checkIn = new Date(
        booking.checkIn
    );

    const checkOut = new Date(
        booking.checkOut
    );


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


    return (

        <div className="
            flex
            flex-col
            gap-y-2
            *:flex
            *:flex-1
            *:justify-between
            text-sm
            *:not-last:text-gray-600
        ">

            {/* Room price */}
            <span>

                <p>
                    ₹{pricePerNight} × {nights}{" "}
                    {nights === 1
                        ? "night"
                        : "nights"}
                </p>

                <p>
                    ₹{pricePerNight * nights}
                </p>

            </span>


            {/* Separator */}
            <span className="
                w-full
                h-0.5
                border-b
                border-b-gray-400
            " />


            {/* Total */}
            <span className="
                font-bold
            ">

                <p>
                    Total
                </p>

                <p>
                    ₹{totalPrice}
                </p>

            </span>

        </div>
    );
};

export const PaymentForm = () => {
    const { setPlace, setCheckIn, setCheckOut, setGuests, ...searchValues } = useSearch();
    const navigate = useNavigate();

    return (
        <div className="h-max flex flex-col gap-y-3 bg-white lg:w-full xl:max-w-9/10 p-5 shadow-sm lg:shadow-xl rounded-2xl ">

            <h3 className="mx-auto lg:underline font-bold">Payment Info</h3>

            <span className="flex justify-between">
                <p><b>$87</b>/Night</p>
                <Review style={"*:last:hidden"} />
            </span>

            <span className="flex gap-6">
                <DateInput name={"Check In"} style={"*:last:border-b-1 *:last:border-b-gray-400"} setDate={setCheckIn} />
                <DateInput name={"Check Out"} style={"*:last:border-b-1 *:last:border-b-gray-400"} setDate={setCheckOut} />
            </span>

            <span className="flex flex-col border-b-1 border-b-gray-400">
                <label htmlFor="guestCount">Guests</label>
                <input id="guestCount" className="input-field" type="number"
                    min={1} placeholder="Total guests" onChange={(ev) => setGuests(ev.target.value)} />
            </span>

            {/* Price Details */}
            <PriceDetails />

            <span className="btn btn-block bg-primary text-white" onClick={() => navigate('/hotels/payment')}>Book Now</span>
            <p className="text-center text-xs text-gray-500">*Lorem ipsum dolor sit amet consectetur</p>

        </div>
    )
}