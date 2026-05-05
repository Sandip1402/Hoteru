
import { useSearch } from "../context/SearchContext"
import { DateInput } from "./DateInput";
import { useNavigate } from "react-router";
import { Review } from "./RoomComponents";

export const PriceDetails = () => {
    return (
        <div className="flex flex-col gap-y-2 *:flex *:flex-1 *:justify-between text-sm *:not-last:text-gray-600">

            {/* discounts, fees */}
            <span>
                <p>$86 * 4 nights</p>
                <p>$348</p>
            </span>

            <span>
                <p>New user discount</p>
                <p className="text-green-700">-$87</p>
            </span>

            <span>
                <p>Service Fee</p>
                <p>$12</p>
            </span>

            <span className="w-full h-0.5 border-b-1 border-b-gray-400"></span>

            {/* Total */}
            <span>
                <p><b>Total (USD)</b></p>
                <p><b>$273</b></p>
            </span>
        </div>
    )
}

export const PaymentForm = () => {
    const { setPlace, setCheckIn, setCheckOut, setGuests, ...searchValues } = useSearch();
    const navigate = useNavigate();

    return (
        <div className="h-max flex flex-col gap-y-3 bg-white lg:min-w-8/9 p-5 shadow-sm lg:shadow-xl rounded-2xl ">

            <h3 className="mx-auto lg:underline"><b>Payment Info</b></h3>

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

            <span className="btn btn-block bg-main-color text-white" onClick={() => navigate('/hotels/payment')}>Book Now</span>
            <p className="text-center text-xs text-gray-500">*Lorem ipsum dolor sit amet consectetur</p>

        </div>
    )
}