import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { apiFetch } from "../js/api"
import { Slide } from "../components/Slide";


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
            <div className="mx-4 text-lg lg:text-2xl ">
                <p className="text-xl mb-2">{item.title}</p>
                <div>
                    <img className="rounded-2xl h-[400px]" src={item.display_img} alt="hotel_image"/>

                    {/* shouldbe added later */}
                    {/* {item.images.length ? <Slide items={item.images} /> : ''} */}

                </div>
                <div className="info">
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

                <div className="reviews col-8 offset-3 mb-3">
                    <hr />
                    <h4>Give a review</h4>
                    <form method="post" action="/home/ { item._id  }/reviews" noValidate className="needs-validation">
                        <div className="mb-3 mt-3">
                            <label htmlFor="rating" className="form-label"></label>
                            <input id="rating" type="range" min="1" max="5" name="review[rating]" className="form-range" required />
                        </div>

                        <div className="mb-3 mt-3">
                            <label htmlFor="comment" className="form-label">Comments</label>
                            <textarea id="comment" placeholder="Leave a comment" className="form-control" cols="10" rows="5"
                                name="review[comment]" required></textarea>
                            <div className="invalid-feedback">Please give a feedback</div>
                        </div>
                        <button className="btn btn-outline-dark">Submit</button>
                    </form>

                    {item.reviews.length} !== 0 &&
                    <hr />
                    <p><b>All Reviews</b></p>
                    <div className="row">
                        {item.reviews.map((review) => {
                            <div className="card col-5 mb-3 ms-3">
                                <div className="card-body p-2">
                                    <div className="card-title d-flex justify-content-between mb-0"><b>Jan doe</b><b>
                                        {review.rating} Stars
                                    </b></div>
                                    <p className="small">
                                        {review.createdAt.toLocaleDateString("en-GB", {
                                            day: "2-digit", month: "2-digit"
                                            , year: "2-digit"
                                        }) + " " + review.createdAt.toLocaleTimeString("en-GB", {
                                            hour: "2-digit", minute: "2-digit", hour12: false
                                        })}
                                    </p>
                                    <p className="card-text">
                                        {review.comment}
                                    </p>
                                </div>
                                <form method="post" className="mb-3 text-end"
                                    action="/home/ { item._id  }/reviews/ { review._id  }?_method=DELETE">
                                    <button className="btn btn-dark btn-sm">Delete</button>
                                </form>
                            </div>
                        })}
                    </div>

                </div>
            </div>
        </>
    )
}
