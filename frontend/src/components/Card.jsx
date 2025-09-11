import { useNavigate } from "react-router-dom";


export const Card = ({ item }) => {

    const navigate = useNavigate();

    return (
        <div className="item-link w-40 h-50 text-xs" onClick={() => navigate(`/info/${item._id}`)}>
            <figure className="h-1/2">
                <img src={item.display_img} alt="image" className="w-full h-full object-cover rounded-2xl" />
            </figure>
            <div className="p-2">
                <b className="">{item.title}</b>
                <p className="text-gray-700">&#8377;{item.price?.toLocaleString("en-IN")} for two nights</p>
            </div>
        </div>
    )
}
