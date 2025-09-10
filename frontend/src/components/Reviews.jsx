import { StarRating } from "./StarRating"


export const Reviews = ({reviews}) => {
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
                        <form method="post" className="mb-3 text-end"
                            action="/home/ { item._id  }/reviews/ { review._id  }?_method=DELETE">
                            <button className="btn btn-sm">Delete</button>
                        </form>
                    </div>
                })}
            </div>
        </div>
    )
}
