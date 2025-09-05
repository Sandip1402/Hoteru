import React from 'react'

export const Show = () => {
  return (
    <>
    
    <div className="my-2 mx-4">
        <p className="text-xl lg:text-2xl mb-2">
            {listing.title}
        </p>
        <div className="info">
            <div className="carousel carousel-center rounded-box w-full sm:grid">
                <div id="slide1" className="carousel-item relative w-full">
                    <img src=" {listing.image }" className="w-full sm:w-44"/>
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between sm:hidden">
                        <a href="#slide4" className="btn btn-circle"><img className="rotate-180" src="/assets/Chevron_right.svg" alt="chevron_left" /></a>
                        <a href="#slide2" className="btn btn-circle"><img src="/assets/Chevron_right.svg" alt="chevron_right" /></a>
                    </div>
                </div>
            </div>
            <div className="">
                <p className="card-text">
                    <br />
                     { listing.description  }
                        <br />
                        &#8377; { listing.price.toLocaleString("en-IN") } for two nights only
                            <br />
                             { listing.location  }
                                <br />
                                 { listing.country  }
                </p>
            </div>
        </div>

        <div className="options btns">
            <a href="/home/ { listing._id  }/edit" className="btn btn-dark col-1 offset-3 edit-btn">Edit</a>

            <form method="POST" action="/home/ { listing._id  }?_method=DELETE">
                <button className="btn btn-dark offset-5">Delete</button>
            </form>
        </div>

        <div className="reviews col-8 offset-3 mb-3">
            <hr />
            <h4>Give a review</h4>
            <form method="post" action="/home/ { listing._id  }/reviews" novalidate className="needs-validation">
                <div className="mb-3 mt-3">
                    <label for="rating" className="form-label"></label>
                    <input id="rating" type="range" min="1" max="5" name="review[rating]" className="form-range" required />
                </div>

                <div className="mb-3 mt-3">
                    <label for="comment" className="form-label">Comments</label>
                    <textarea id="comment" placeholder="Leave a comment" className="form-control" cols="10" rows="5"
                        name="review[comment]" required></textarea>
                    <div className="invalid-feedback">Please give a feedback</div>
                </div>
                <button className="btn btn-outline-dark">Submit</button>
            </form>

            {listing.reviews.length} !== 0 &&
                <hr />
                <p><b>All Reviews</b></p>
                <div className="row">
                    {listing.reviews.map((review) => {
                        <div className="card col-5 mb-3 ms-3">
                            <div className="card-body p-2">
                                <div className="card-title d-flex justify-content-between mb-0"><b>Jan doe</b><b>
                                         { review.rating  } Stars
                                    </b></div>
                                <p className="small">
                                     { review.createdAt.toLocaleDateString("en-GB",{ day: "2-digit" , month: "2-digit"
                                        , year: "2-digit" }) + " " + review.createdAt.toLocaleTimeString("en-GB", {
                                        hour: "2-digit" , minute: "2-digit" , hour12: false})  }
                                </p>
                                <p className="card-text">
                                     { review.comment  }
                                </p>
                            </div>
                            <form method="post" className="mb-3 text-end"
                                action="/home/ { listing._id  }/reviews/ { review._id  }?_method=DELETE">
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
