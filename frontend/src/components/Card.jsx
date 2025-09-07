

export const Card = ({ item }) => {
    return (
        <a href={`/home/${item._id}`} className="item-link">
            <div className="card bg-base-100 w-50 h-60 m-2 shadow-sm snap-center">
                <figure className="h-1/2">
                    <img src={item.image} alt="Home_image" className="object-cover" />
                </figure>
                <div className="card-body p-2">
                    <b className="card-title text-sm md:text-lg">{item.title}</b>
                    <p className="text-gray-700">&#8377;{item.price.toLocaleString("en-IN")} for two nights</p>
                </div>
            </div>
        </a>
    )
}
