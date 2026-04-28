import { Review } from "./RoomCard"
import { useSearch } from "../context/SearchContext"
import { DateInput } from "./DateInput";

export const PaymentForm = () => {
    const { setPlace, setCheckIn, setCheckOut, setGuests, ...searchValues } = useSearch();

    return (
        <div className="h-max flex flex-col gap-y-3 bg-white lg:min-w-4/5 p-5 shadow-sm lg:shadow-xl rounded-2xl ">

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

            {/*fix - discounts, fees */}
            <span></span>

            <span className="w-full h-0.5 border-b-1 border-b-gray-400"></span>

            {/*fix - total */}
            <span></span>

            <span className="btn btn-block bg-main-color text-white">Pay</span>
            <p className="text-center text-gray-500">Lorem ipsum dolor sit amet consectetur</p>

        </div>
    )
}