import { FaLine } from "react-icons/fa";
import { useSearch } from "../context/SearchContext"


const NavSearch = () => {
    const {setPlace, setCheckIn, setCheckOut, setGuests, ...searchValues} = useSearch();


  return (
    <form className="px-4 py-2 h-max rounded-full w-max lg:max-w-1/3 bg-white shadow flex justify-evenly items-center gap-2">
        <span className="cursor-pointer text-gray-500">Place</span>
        <span className="h-0.5 w-5 bg-gray-800 rotate-90"></span>
        <span className="cursor-pointer text-gray-500">Check In</span>
        <span className="h-0.5 w-5 bg-gray-800 rotate-90"></span>
        <span className="cursor-pointer text-gray-500">Check Out</span>
        <span className="h-0.5 w-5 bg-gray-800 rotate-90"></span>
        <span className="cursor-pointer text-gray-500">Guest</span>
    </form>
  )
}

export default NavSearch