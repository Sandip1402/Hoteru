

export const Edit = (listing) => {
    return (
        <>
            <div className="row mt-2 mb-3">
                <div className="col-8 offset-2">
                    <h2>Update Listing Details</h2>
                    <form method="POST" action="/home/  listing._id  ?_method=PUT" novalidate className="needs-validation">

                        <div className="mb-3">
                            <label for="title" className="form-label">Title</label>
                            <input name="listing[title]" value=" listing.title " placeholder="enter title" type="text"
                                className="form-control" required />
                                <div className="invalid-feedback">Give a title</div>
                        </div>

                        <div className="mb-3">
                            <label for="description" className="form-label">Description</label>
                            <textarea name="listing[description]" placeholder="enter description" rows="5" cols="40"
                                className="form-control" required> listing.description </textarea>
                            <div className="invalid-feedback">Give a short description</div>
                        </div>

                        <div className="mb-3">
                            <label for="image" className="form-label">Update image</label>
                            <input name="listing[image]" placeholder="enter image url/link" value=" listing.image "
                                type="text" className="form-control" required />
                                <div className="invalid-feedback">Give image link</div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-4">
                                <label for="price" className="form-label">Update price</label>
                                <input name="listing[price]" placeholder="enter price" value=" listing.price " type="number"
                                    className="form-control" required />
                                    <div className="invalid-feedback">Enter price</div>
                            </div>

                            <div className="mb-3 col-md-8">
                                <label for="country" className="form-label">Update country</label>
                                <input name="listing[country]" placeholder="enter country" value=" listing.country "
                                    type="text" className="form-control" required />
                                    <div className="invalid-feedback">Enter valid country</div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label for="location" className="form-label">Update Location</label>
                            <input name="listing[location]" placeholder="enter location" value=" listing.location"
                                type="text" className="form-control" required />
                                <div className="invalid-feedback">Enter valid location</div>
                        </div>

                        <button className="btn btn-dark update-btn">Update</button>
                    </form>
                </div>
            </div>
        </>
    )
}
