// import { useState } from "react";
// import { FiHeart } from "react-icons/fi";
// import { useNavigate } from "react-router";
// import { Amenities, Review } from "./RoomComponents";


// export const RoomCard = () => {

//     const navigate = useNavigate();
//     const [save, setSave] = useState(false);

//     return (
//         <div className="max-sm:flex rounded-2xl bg-white">

//             <span className="cursor-pointer max-sm:w-1/2 sm:w-50 sm:flex sm:flex-col">
//                 {/* photos */}
//                 <img src="/room1.jpg" alt="room_image" className="rounded-2xl object-cover w-full sm:h-4/5"
//                     onClick={() => navigate(`/hotels/roomdetails`)} />
                
//                 {/* Desktop view */}
//                 <section className="max-sm:hidden flex flex-col text-xs p-1 gap-y-1 *:flex *:justify-between">
//                     <div>
//                         <p>Harley Connection</p>
//                         <Review style={'*:last:hidden'} />
//                     </div>
//                     {/* Fix - add save button */}
//                     <div>
//                         <p className="text-gray-500">Apartment in ueno</p>
//                         <span className="block text-end">$49/guest</span>
//                     </div>
//                     <Amenities style={'text-white *:p-2 *:bg-primary/80 *:rounded-box'} />
//                 </section>
//             </span>

//             {/* mobile view */}
//             <div className="sm:hidden px-2 flex flex-col justify-between flex-1">
//                 {/* Intro */}
//                 <section className="flex flex-col">
//                     <span className="flex items-center justify-between">
//                         <p className="text-gray-500">Apartment in ueno</p>

//                         {/* save */}
//                         <span className="cursor-pointer" onClick={() => setSave(!save)}>
//                             <FiHeart strokeWidth={save ? "0" : "1"} fill={save ? "blue" : "none"} />
//                         </span>
//                     </span>
//                     <p>Harley Connection</p>
//                 </section>

//                 <div className="w-30 h-0.5 border-b-1 border-b-gray-400"></div>

//                 {/* Amenities */}
//                 {/* fix - show only 3/4 */}
//                 <Amenities style={"max-sm:text-gray-500 gap-x-2"} />

//                 {/* Review & price */}
//                 <section className="flex justify-between">
//                     <Review style={"max-sm:*:last:hidden"} />
//                     <p>$49/guest</p>
//                 </section>
//             </div>
//         </div>
//     )
// }


import { Link } from "react-router";

const FALLBACK_IMAGE = "/images/room-placeholder.jpg";

export const RoomCard = ({ room, link }) => {
    const image = room.images?.[0];

    return (
        <Link
            to={link}
            className="block min-w-[280px]"
        >
            <article className="overflow-hidden rounded-lg border bg-white transition hover:shadow-md">
                {/* Room Image */}
                <div className="h-48 w-full">
                    <img
                        src={image?.imageUrl || FALLBACK_IMAGE}
                        alt={image?.altText || room.name}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Room Details */}
                <div className="p-4">
                    <h3 className="font-semibold">
                        {room.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {room.roomType}
                    </p>

                    <p className="mt-2 text-sm">
                        {room.maxGuests}{" "}
                        {room.maxGuests === 1
                            ? "guest"
                            : "guests"}{" "}
                        · {room.beds}{" "}
                        {room.beds === 1 ? "bed" : "beds"}

                        {room.bedrooms != null && (
                            <>
                                {" · "}
                                {room.bedrooms}{" "}
                                {room.bedrooms === 1
                                    ? "bedroom"
                                    : "bedrooms"}
                            </>
                        )}
                    </p>

                    <p className="mt-3 font-semibold">
                        ₹{room.basePrice} / night
                    </p>
                </div>
            </article>
        </Link>
    );
}