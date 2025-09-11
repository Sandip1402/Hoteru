import { useEffect, useState } from "react"
import { StarRating } from "./StarRating"
import { apiFetch } from "../js/api"


export const Reviews = ({id, reviews}) => {
    const [reviewId, setReviewId] = useState("");

    useEffect(() => {
        // api calling
        const res = apiFetch(`/listings/${id}/reviews/${reviewId}`, 
            {method : DELETE}
        )
        if(!res.success){
            throw new Error("Could not delete review");
        }
        setReviewId("");
    }, [reviewId])

    return (
        <div>
            <hr />
            <p><b>All Reviews</b></p>
            <div className="row">
                {reviews.map((review) => {
                    <div className="card col-5 mb-3 ms-3">
                        <div className="card-body p-2">
                            <div className="card-title d-flex justify-content-between mb-0">
                                <b>Jan doe</b>
                                <StarRating rating={review.rating}/>
                            </div>
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
                        <button className="btn btn-sm" onClick={() => {setReviewId(review._id)}}>Delete</button>
                    </div>
                })}
            </div>
        </div>
    )
}
