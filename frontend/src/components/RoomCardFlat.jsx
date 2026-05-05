import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router";
import { Amenities, Review } from "./RoomComponents";

{/* for smaller screen */ }

export const RoomCardFlat = () => {

    const navigate = useNavigate();
    const [save, setSave] = useState(false);

    return (
        <div className="flex rounded-2xl mb-2">

            {/* photos */}
            <span className="cursor-pointer max-sm:w-1/2 sm:w-70">
                <img src="/room1.jpg" alt="room_image" className="rounded-2xl object-cover w-full"
                    onClick={() => navigate(`/hotels/roomdetails`)} />
            </span>

            <div className="px-2 sm:px-3 flex flex-col justify-between flex-1">
                {/* Intro */}
                <section className="flex flex-col">
                    <span className="flex items-center justify-between">
                        <p className="text-gray-500">Apartment in ueno</p>

                        {/* save */}
                        <span className="cursor-pointer" onClick={() => setSave(!save)}>
                            <FiHeart strokeWidth={save ? "0" : "1"} fill={save ? "blue" : "none"} />
                        </span>
                    </span>
                    <p>Harley Connection</p>
                </section>

                <div className="w-30 h-0.5 border-b-1 border-b-gray-400"></div>

                {/* Amenities */}
                <Amenities style={"max-sm:text-gray-500 sm:w-4/5 sm:gap-y-2 sm:gap-2 sm:text-white sm:*:p-2 sm:*:bg-main-color/60 sm:*:rounded-box"} />

                {/* Review & price */}
                <section className="flex justify-between">
                    <Review style={"max-sm:*:last:hidden"} />
                    <span className="block text-end">$49/guest</span>
                </section>
            </div>
        </div>
    )
}