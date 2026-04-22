import { FaSearch } from "react-icons/fa"
import { useSearch } from "../context/SearchContext";

function Search() {

    const searchValues = useSearch();

    return (
        <form className={`h-max w-max xl:min-w-3/5  xl:min-h-20 rounded-full sticky z-1 flex justify-between items-center p-2 m-auto shadow bg-white`}>
            <span className="text-black md:mx-4">
                <label htmlFor="place">Location</label>
                <input className="input-field block" id="place" type="text" autoComplete="on" placeholder="Where are you going?" />
            </span>
            <span className="text-black md:mx-4">
                <label>Check in</label>
                <input className="input-field block" type="date" placeholder="pick date" onClick={(ev) => console.log(ev)} />
            </span>
            <span className="text-black md:mx-4">
                <label>Check out</label>
                <input className="input-field block" type="date" placeholder="Pick date" />
            </span>
            <span className="text-black md:mx-4">
                <label>Guests</label>
                <input className="input-field block" type="number" min={1} placeholder="Total guests" />
            </span>
            <div className="btn btn-circle bg-main-color text-white" onClick={() => { console.log(searchValues) }}><FaSearch /></div>
        </form>
    )
}

export default Search;