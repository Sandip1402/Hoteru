import { useState, useEffect } from "react";
import { CallAPI } from "../util/callAPI.js";
import { FiMenu } from "react-icons/fi";
import { CheckFilter } from "../components/CheckFilter.jsx";
import { RangeFilter } from "../components/RangeFilter.jsx";
import BubbleFilter from "../components/BubbleFilter.jsx";
import { RoomCard } from "../components/RoomCard.jsx";
import { RoomCardFlat } from "../components/RoomCardFlat.jsx";

export const Hotel = () => {
    // const [listings, setListings] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // 

    // useEffect(() => {

    //     const fetchItem = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);

    //             const res = await CallAPI('/listings', { method: "GET" });
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
        <div className="py-1 lg:px-20 w-full flex justify-around">

            {/* Filter Options */}
            <div className="hidden lg:block filters bg-white py-2 px-5 h-max w-75 flex-col border-r-gray-600">
                <CheckFilter showOptions={true} name={"Property type"} options={["Hotel", "Guest House", "House", "Apartment"]} />
                <CheckFilter showOptions={true} name={"Price"} options={["Below $50", "$50 to $99", "$100 to $200", "Above $200"]} />
                <RangeFilter name={"Reviews"} maxVal={5} />
                <BubbleFilter name={"Amenities"} options={["Kitchen", "WiFi", "AC", "TV", "Fridge", "Wardrobe", "Desk"]} />
                {/* <FilterItem name={"Rooms & beds"} /> */}
                {/* <FilterItem name={"Accessibility"} /> */}
            </div>

            {/* Rooms */}
            <div className="flex flex-col py-2 max-md:px-3 md:px-5 xl:hidden">
                {/* Need to add later */}
                {/* <span className="w-full text-gray-500">150+ rooms</span> */}
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
                <RoomCardFlat />
            </div>

            <div className="max-xl:hidden xl:flex py-2 w-full gap-3 flex-wrap justify-end">
                {/* Need to add later */}
                {/* <span className="w-full text-gray-500">150+ rooms</span> */}
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
