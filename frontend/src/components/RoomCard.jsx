import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router"
import { Amenities, Review } from "./RoomComponents";


export const RoomCard = () => {

    // const [hotelImg, setHotelImg] = useState(null);
    // useEffect(() => {
    //     const fetchImage = async() => {
    //         setHotelImg(item.display_img);
    //     }
    //     fetchImage();

    // }, [])

    const navigate = useNavigate();
    const [save, setSave] = useState(false);


    return (
        <div className="flex rounded-2xl mb-2">

            {/* photos */}
            <span className="cursor-pointer w-80 h-max">
                <img src="/room1.jpg" alt="room_image" className="rounded-2xl object-cover w-full h-4/5"
                    onClick={() => navigate(`/hotels/roomdetails`)} />

                {/* small info at large screen - reduce scrolling */}
                <section className="flex flex-col p-1 gap-y-1 *:flex *:justify-between">
                    <div>
                        <p>Harley Connection</p>
                        <Review />
                    </div>
                    {/* Fix - add save button */}
                    <div>
                        <p className="text-gray-500">Apartment in ueno</p>
                        <span className="block text-end">$49/guest</span>
                    </div>
                    <Amenities style={'text-white *:p-2 *:bg-primary/60 *:rounded-box'} />
                </section>
            </span>

        </div>
    )
}

