import { useNavigate } from "react-router-dom";


export const Card = ({ item }) => {

    const navigate = useNavigate();

    return (
        <div className="item-link w-3/4 h-1/2" onClick={() => navigate(`/info/${item._id}`)}>
            <figure className="">
                <img src={item.display_img} alt="image" className="h-full object-cover rounded-2xl" />
            </figure>
            <div>
                <b className="text-sm md:text-lg">{item.title}</b>
                <p className="text-gray-700">&#8377;{item.price?.toLocaleString("en-IN")} for two nights</p>
            </div>
        </div>
    )
}
