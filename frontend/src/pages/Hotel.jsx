import { useState, useEffect } from "react";
import { CallAPI } from "../util/callAPI.js";
import { FiMenu } from "react-icons/fi";

import { CheckFilter, RangeFilter, BubbleFilter, RoomCard } from "../components";


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
        <div className="w-full py-5 flex justify-evenly lg:px-20">

            {/* Filter Options */}
            <div className="hidden lg:flex flex-col h-max w-5/20 p-2 bg-white">
                <CheckFilter showOptions={true} name={"Property Type"} options={["Hotel", "Guest House", "House", "Apartment"]} />
                <CheckFilter showOptions={true} name={"Price"} options={["Below $50", "$50 to $99", "$100 to $200", "Above $200"]} />
                <RangeFilter name={"Rating"} maxVal={5} />
                <BubbleFilter name={"Amenities"} options={["Kitchen", "WiFi", "AC", "TV", "Fridge", "Wardrobe", "Desk"]} />
                {/* <FilterItem name={"Rooms & beds"} /> */}
                {/* <FilterItem name={"Accessibility"} /> */}
            </div>

            {/* fix - Need to add later */}
            {/* <span className="w-full text-gray-500">150+ rooms</span> */}

            {/* Rooms */}
            <div className="flex max-sm:flex-col max-sm:px-3 max-sm:gap-y-3 lg:w-13/20 sm:p-3 sm:gap-3 sm:flex-wrap 
                                    max-lg:justify-center 2xl:p-5 2xl:gap-5 max-w-7xl">
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
                <RoomCard />
                <RoomCard />
                <RoomCard />
            </div>
            
        </div>
    )
}
