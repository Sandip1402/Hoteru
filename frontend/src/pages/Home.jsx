

export const Home = () => {




    return (
        <>
            <div className="my-2 px-4 w-full">
                <div className="mx-2 flex justify-between">
                    <p className="text-xl"><b>Homes</b></p>
                    <div className="flex justify-between">
                        <button className="scroll-btn move-left">
                            <img className="rotate-180" src="/assets/Chevron_right.svg" alt="chevron_left" />
                        </button>
                        <button className="scroll-btn move-right">
                            <img src="/assets/Chevron_right.svg" alt="chevron_right" />
                        </button>
                    </div>
                </div>
                <div className="home-list tw-home-list">
                    {listings.map((listing) => (
                        <a href="/home/<%=listing._id%>" className="listing-link">
                            <div className="card bg-base-100 w-50 h-60 m-2 shadow-sm snap-center">
                                <figure className="h-1/2">
                                    <img src="<%=listing.image%>" alt="Home_image" className="object-cover" />
                                </figure>
                                <div className="card-body p-2">
                                    <b className="card-title text-sm md:text-lg">{listing.title}</b>
                                    <p className="text-gray-700">&#8377;{listing.price.toLocaleString("en-IN")} for two nights</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </>
    )
}
