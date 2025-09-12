

export const New = () => {


    return (
        <>
            <form  novalidate className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg select-none needs-validation">
                <h3 className="text-xl font-bold mb-6 text-center">Enter Listing Details</h3>
                <div className="mb-3">
                    <label for="title" className="form-label">Title</label>
                    <input name="listing[title]" placeholder="Hotel Name" type="text" className="form-control" required />
                    <div className="valid-feedback">Title looks good!</div>
                    <div className="invalid-feedback">Give a title</div>
                </div>

                <div className="mb-3">
                    <label for="description" className="form-label">Description</label>
                    <textarea name="listing[description]" type="text" className="form-control" required></textarea>
                    <div className="invalid-feedback">Give short description</div>
                </div>

                <div className="mb-3">
                    <label for="image" className="form-label">Image Link</label>
                    <input name="listing[image]" type="text" placeholder="enter image url/link" className="form-control" />
                </div>

                <div className="row">
                    <div className="mb-3 col-md-4">
                        <label for="price" className="form-label">Price</label>
                        <input name="listing[price]" type="number" placeholder="Ex: 1200" className="form-control" required />
                        <div className="invalid-feedback">Enter price</div>
                    </div>

                    <div className="mb-3 col-md-8">
                        <label for="country" className="form-label">Country</label>
                        <input name="listing[country]" type="text" placeholder="Ex: India" className="form-control" required />
                        <div className="invalid-feedback">Enter valid country</div>
                    </div>
                </div>

                <div className="mb-3">
                    <label for="location" className="form-label">Location</label>
                    <input name="listing[location]" type="text" placeholder="Ex: Patna, Bihar" className="form-control" required />
                    <div className="invalid-feedback">Enter valid location</div>
                </div>
                <button className="btn btn-dark add-btn">Add</button>
                <br />
            </form>
        </>
    )
}
