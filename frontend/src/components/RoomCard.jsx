import { useEffect, useState } from "react";
import { FiHeart, FiStar, FiStopCircle } from "react-icons/fi";
import { useNavigate } from "react-router"


export const Review = ({style}) => {
    return (
        <span className={`flex items-center gap-1 ${style}`}>
            <FiStar strokeWidth={"0"} fill="blue" />
            <p>3.5</p>
            <p className="text-gray-500">(234 reviews)</p>
        </span>
    )
}
export const Amenities = ({ style }) => {
    return (
        <ul className={`w-full text-xs flex flex-wrap gap-1 text-white 
                    *:p-2 *:bg-main-color/60 *:rounded-box ${style}`} >
            <li>2bed</li>
            <li>4guests</li>
            <li>2baths</li>
            <li>Air Conditioning</li>
        </ul>
    )
}

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
            <span className="cursor-pointer max-sm:w-1/2 sm:w-70 
                    xl:w-80 max-xl:h-full xl:h-max"
                onClick={() => navigate(`/hotels/roomdetails`)}>
                <img src="bg2.jpg" alt="room_image" className="rounded-2xl object-cover w-full max-xl:h-full xl:h-4/5" />

                {/* small info at large screen - reduce scrolling*/}
                <section className="hidden xl:flex flex-col p-1 gap-y-1 *:flex *:justify-between">
                    <div>
                        <p>Harley Connection</p>
                        <Review />
                    </div>
                    <div>
                        <p className="text-gray-500">Apartment in ueno</p>
                        <span className="block text-end">$49/guest</span>
                    </div>
                    <Amenities />
                </section>
            </span>


            {/* Info for small screen */}
            <div className="xl:hidden px-2 sm:px-3 flex flex-col justify-between max-sm:flex-1">
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

                <div className="max-sm:hidden w-20 h-0.5 bg-gray-300"></div>

                {/* Amenities */}
                <Amenities style={"sm:w-4/5 sm:gap-y-2 sm:gap-2 max-sm:*:px-2 max-sm:*:py-1"} />

                {/* Review & price */}
                <section className="flex justify-between">
                    <Review style={"max-sm:*:last:hidden"} />
                    <span className="block text-end">$49/guest</span>
                </section>
            </div>
        </div>
    )
}

