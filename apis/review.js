const validateData = require("../utils/middlewares/validateData.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports = (app) => {
    // add Review Route
    app.post("/home/:id/reviews", validateData, wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log(`New review saved for ${listing.title}`);
        res.redirect(`/home/${req.params.id}`);
    })
    )
    app.delete("/home/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        console.log(reviewId);
        let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        let review = await Review.findByIdAndDelete(reviewId);

        console.log(`Review Deleted for ${listing.title}`);
        console.log("--------------------------------------")
        console.log(review);

        res.redirect(`/home/${id}`);
    }
    ))
}