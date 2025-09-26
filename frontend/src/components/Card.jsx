import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"


export const Card = ({ item }) =>{

    // const [hotelImg, setHotelImg] = useState(null);
    // useEffect(() => {
    //     const fetchImage = async() => {
    //         setHotelImg(item.display_img);
    //     }
    //     fetchImage();

    // }, [])

    const navigate = useNavigate();

    return (
        <div className="w-40 cursor-pointer overflow-x-clip" onClick={() => navigate(`/hotel/${item._id}`)}>
            <figure className="h-[100px] flex justify-center items-center">
                    <img src={item.display_img} title="hotel_image" className="w-full h-full object-cover rounded-2xl" />
            </figure>
            <div className="p-2">
                <b className="">{item.title}</b>
                <p className="text-gray-700">&#8377;{item.price?.toLocaleString("en-IN")} for two nights</p>
            </div>
        </div>
    )
}

