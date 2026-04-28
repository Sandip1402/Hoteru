import { FaSearch } from "react-icons/fa"
import { useSearch } from "../context/SearchContext";
import { DateInput } from "./DateInput";

function Search() {

    const { setPlace, setCheckIn, setCheckOut, setGuests, ...searchValues } = useSearch();


    return (

        <form className="m-auto shadow bg-white sticky z-5 flex max-sm:p-3 max-sm:flex-col max-sm:rounded-2xl max-sm:gap-y-2 
                        sm:px-4 sm:py-2 sm:max-w-fit sm:rounded-full sm:justify-between sm:items-center"
                        onSubmit={(ev) => { ev.preventDefault(); console.log(searchValues) }}>

            {/* Place selection */}
            <span className="w-30">
                <label htmlFor="place">Location</label>
                <input className="input-field" size={10} id="place" type="text" autoComplete="on"
                    placeholder="Place" onChange={(ev) => setPlace(ev.target.value)} />
            </span>

            {/* Dates */}
            <span className="flex max-sm:gap-6 sm:hidden">
                <DateInput name={"Check In"} style={"max-sm:*:last:border-b-1 max-sm:*:last:border-b-gray-400"} setDate={setCheckIn}/>
                <DateInput name={"Check Out"} style={"max-sm:*:last:border-b-1 max-sm:*:last:border-b-gray-400"} setDate={setCheckOut} />
            </span>
            <DateInput name={"Check In"} style={"max-sm:hidden"} />
            <DateInput name={"Check Out"} style={"max-sm:hidden"} />

            {/* Guest Count */}
            <span className="w-30">
                <label htmlFor="guestCount">Guests</label>
                <input id="guestCount" className="input-field" type="number"
                    min={1} placeholder="Total guests" onChange={(ev) => setGuests(ev.target.value)} />
            </span>

            <button className="btn btn-block sm:btn-circle bg-main-color text-white">
                <FaSearch />
            </button>
        </form>

    )
}

export default Search;