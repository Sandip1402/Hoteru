import { FaSearch } from "react-icons/fa"
import { useSearch } from "../context/SearchContext";
import { DateInput } from "./DateInput.jsx";

export const Search = () => {

    const { setPlace, setCheckIn, setCheckOut, setGuests, ...searchValues } = useSearch();


    {/* Top-down width : parent decides child width */ }
    return (
        <form className="m-auto shadow bg-white sticky z-5 flex max-sm:flex-col max-sm:p-3 max-sm:rounded-2xl max-sm:gap-y-2
                        sm:items-center sm:rounded-full sm:px-6 sm:py-3 lg:max-w-fit 2xl:max-w-3/5"
            onSubmit={(ev) => { ev.preventDefault(); console.log(searchValues) }}>
                
            <main className="flex text-gray-400 max-sm:flex-col max-sm:gap-y-2 sm:flex-1 sm:**:flex-1
                         sm:items-center">

                {/* Place selection */}
                <span className="max-sm:w-full flex flex-col w-1/4">
                    <label htmlFor="place">Location</label>
                    {/* fix - turn of underlined error squiggle */}
                    <input className="input-field" id="place" name="place" type="text"
                        placeholder="Place" onChange={(ev) => setPlace(ev.target.value)} />
                </span>

                {/* Dates */}
                <span className="flex max-sm:gap-6 sm:hidden">
                    <DateInput name={"mobileCheckIn"} setDate={setCheckIn} />
                    <DateInput name={"mobileCheckOut"} setDate={setCheckOut} />
                </span>
                <DateInput name={"checkIn"} style={"max-sm:hidden w-1/4 pr-6"} />
                <DateInput name={"checkOut"} style={"max-sm:hidden w-1/4 pr-6"} />

                {/* Guest Count */}
                <span className="max-sm:w-full flex flex-col w-1/4">
                    <label htmlFor="guests">Guests</label>
                    <input id="guests" name="guests" type="number" className="input-field"
                        min={1} placeholder="Total guests" onChange={(ev) => setGuests(ev.target.value)} />
                </span>

            </main>

            <button className="btn btn-block sm:btn-circle bg-primary text-white sm:relative sm:left-2">
                <FaSearch />
            </button>
        </form>

    )
}
