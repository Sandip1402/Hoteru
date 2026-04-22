import { useState, useEffect } from "react";
import { fetchApi } from "../util/api.js";
import { FiMenu } from "react-icons/fi";
import { CheckFilter } from "../components/CheckFilter.jsx";
import { RangeFilter } from "../components/RangeFilter.jsx";
import BubbleFilter from "../components/BubbleFilter.jsx";
import { RoomCard } from "../components/RoomCard.jsx";

export const Hotel = () => {
    // const [listings, setListings] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const apiFetch = fetchApi();

    // useEffect(() => {

    //     const fetchItem = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);

    //             const res = await apiFetch('/listings', { method: "GET" });
    //             setListings(res.data);
    //         } catch {
    //             setError("Failed to load hotels 😢");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchItem();
    // }, []);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p className="text-red-500">{error}</p>;
    // if (!listings) return <p>No data found</p>;

    // const [showFilter, setShowFilter] = useState(false);
    // useEffect(() => {

    // }, [showFilter])
    // // if(window.screen.width >= 1440){
    // //     setShowFilter(true);
    // // }


    return (
        <div className="py-1 lg:px-20 w-full h-max flex">

            {/* Filter Options */}
            <div className="hidden lg:block filters bg-white py-2 px-5 h-150 w-75 flex-col border-r-gray-600">
                <CheckFilter showOptions={true} name={"Property type"} options={["Hotel", "Guest House", "House", "Apartment"]} />
                <CheckFilter showOptions={true} name={"Price"} options={["Below $50", "$50 to $99", "$100 to $200", "Above $200"]} />
                <RangeFilter name={"Reviews"} maxVal={5} />
                <BubbleFilter name={"Amenities"} options={["Kitchen", "WiFi", "AC", "TV", "Fridge", "Wardrobe", "Desk"]} />
                {/* <FilterItem name={"Rooms & beds"} /> */}
                {/* <FilterItem name={"Accessibility"} /> */}
            </div>

            {/* Rooms */}
            <div className="flex-1 lg:px-10 lg:py-5 flex-col xl:flex">
                <p className="text-gray-500">150+ rooms</p>
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
                <RoomCard />
            </div>

        </div>
    )
}
