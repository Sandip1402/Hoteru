import { FaSearch } from "react-icons/fa"
import { useSearch } from "../context/SearchContext";
import CheckInOut from "./CheckInOut";

function Search() {

    const {setPlace, setCheckIn, setCheckOut, setGuests, ...searchValues} = useSearch();


    return (
        
        <form className="h-max xl:min-h-20 max-md:w-full md:max-w-fit rounded-2xl md:rounded-full sticky
                            z-5 max-md:flex-col md:flex md:justify-between md:items-center max-md:p-3 md:p-2 
                            md:py-2 lg:px-8 m-auto shadow bg-white"
                    onSubmit={(ev) =>{ev.preventDefault(); console.log(searchValues)}}>
            
            {/* Place selection */}
            <span className="text-black md:mx-2">
                <label htmlFor="place">Location</label>
                <input className="input-field block w-full" id="place" type="text" autoComplete="on" 
                    placeholder="Where are you going?" onChange={(ev) => setPlace(ev.target.value)} />
            </span>

            <CheckInOut />

            {/* Guest Count */}
            <span className="text-black md:ml-7 lg:mx-2 lg:pl-10">
                <label htmlFor="guestCount">Guests</label>
                <input id="guestCount" className="input-field block w-full" type="number" 
                    min={1} placeholder="Total guests" onChange={(ev) => setGuests(ev.target.value)} />
            </span>

            <button className="btn btn-block mt-3 md:btn-circle bg-main-color text-white">
                <FaSearch />
            </button>
        </form>
        
    )
}

export default Search;