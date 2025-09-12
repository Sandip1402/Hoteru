import { useEffect, useState } from "react"
import { StarRating } from "./StarRating"


export const Reviews = ({reviews}) => {
    const[allReview, setAllReview] = useState(reviews);

    useEffect(() => {
        setAllReview(reviews);
    },[reviews])

    return (
        <>
            <div className="h-auto flex flex-col items-baseline justify-center">
                <p><b>Reviews</b></p>
                {allReview.map((review) => 
                    <div className="mb-3 w-full" key={review._id}>
                        <hr />
                        <div className="px-3">
                            <div className="pb-3 flex justify-between items-baseline">
                                <span className="flex flex-col sm:flex-row sm:items-baseline">Jan doe
                                    <small className="sm:ml-2 text-xs font-extralight text-gray-500">
                                        {new Date(review.createdAt).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })}
                                    </small>
                                </span>
                                <StarRating rating={review.rating}/>
                            </div>
                            <p className="mb-3">{review.comment}</p>
                        </div>
                        {/* <button className="mx-3 btn btn-dash" onClick={() => {setReviewId(review._id)}}>Delete</button> */}
                    </div>
                )}
            </div>
        </>
    )
}
