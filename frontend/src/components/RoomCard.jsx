import { useEffect, useState } from "react";
import { FiHeart, FiStar, FiStopCircle } from "react-icons/fi";
import { useNavigate } from "react-router"


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
        <div className="flex rounded-2xl my-2">
            <span className="cursor-pointer w-70 h-40" onClick={() => navigate(`/hotels/roomdetails`)}>
                <img src="bg2.jpg" alt="room_image" className="rounded-2xl object-cover w-full h-full" />
            </span>
            <div className="flex-1 px-3 flex-col">
                {/* Intro */}
                <section className=" flex">
                    <span className="flex-1">
                        <p className="text-gray-500">Apartment in ueno</p>
                        <p>Harley Connection</p>
                    </span>
                    {/* save */}
                    <span className="self-start cursor-pointer" onClick={() => setSave(!save)}>
                        <FiHeart strokeWidth={save ? "0" : "1"} fill={save ? "blue" : "none"} />
                    </span>
                </section>

                <div className="my-3 w-20 h-0.5 bg-gray-300"></div>

                {/* Amenities */}
                <ul className="w-3/4 flex flex-wrap text-gray-500 gap-3" >
                    <li>2bed</li>
                    <li>4guests</li>
                    <li>2baths</li>
                    <li>Air Conditioning</li>
                </ul>

                {/* Review & price */}
                <section>
                    <span className="block text-gray-500 text-end">Nightly $49/guest</span>
                    <div className="flex">
                        <span className="flex items-center gap-1">
                            <FiStar strokeWidth={"0"} fill="blue" />
                            <p>3.5</p>
                            <p className="text-gray-500">(234 reviews)</p>
                        </span>
                        <span className="text-end flex-1">
                            Total $196
                        </span>
                    </div>
                </section>
            </div>
        </div>
    )
}

