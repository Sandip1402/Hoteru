import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { apiFetch } from "../js/api"
import { Slide } from "../components/Slide";
import { Reviews } from "../components/Reviews";
import { ReviewForm } from "../components/ReviewForm";



export const Show = () => {
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await apiFetch(`/listings/${id}`, { method: "GET" });
                setItem(res.data);
            } catch (err) {
                setError("Failed to load hotel detail 😢");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!item) return <p>No listing found</p>;


    return (
        <>
            <div className="m-4 flex-col items-center text-lg lg:text-2xl">
                <p className="text-xl mb-2">{item.title}</p>
                <div className="flex justify-center items-center">
                    <img className="rounded-2xl w-45 h-60 hobject-cover" src={item.display_img} alt="hotel_image"/>

                    {/* should be added later */}
                    {/* {item.images.length ? <Slide items={item.images} /> : ''} */}

                </div>
                <div className="info flex-col justify-center items-start p-2">
                    <div className="card-text">
                        <p className="my-3">{item.description}</p>
                        <p className="my-3">&#8377; {item.price.toLocaleString("en-IN")} for two nights only</p>
                        <p><b>Address:</b></p>
                        <p className="mb-3">{item.location},{item.country}</p>
                    </div>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Book Now</button>
                    </div>
                </div>

                {/* Should be added in host profile */}
                {/* <div className="options btns">
                    <NavLink  className="btn btn-dark col-1 offset-3 edit-btn">Edit</NavLink>

                    <form method="POST" action="/home/ { item._id  }?_method=DELETE">
                        <button className="btn btn-dark offset-5">Delete</button>
                    </form>
                </div> */}

                <div className="reviews mb-3">
                    <br />
                    <hr />
                    <ReviewForm id={id}/>
                    {item.reviews.length !== 0 ? (<Reviews reviews={item.reviews}/>) : ''}
                </div>
            </div>
        </>
    )
}
