const validateData = require("../utils/middlewares/validateData.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports = (app) => {
    // add Review Route
    app.post("/api/listings/:id/reviews", validateData, wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        if(!listing){
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            })
        }
        if (!req.body.review || Object.keys(req.body.review).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Review is empty"
            });
        }
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log(`New review saved for ${listing.title}`);
        res.status(201).json({
            success: true,
            message: `New review added to ${listing.title}`
        })
    })
    )
    app.delete("/api/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;

        let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        if(!listing){
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            })
        }
        let review = await Review.findByIdAndDelete(reviewId);
        if(!review){
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        console.log(`Review Deleted for ${listing.title}`);
        console.log("--------------------------------------")
        console.log(review);

        res.status(204).json({
            success: true,
            message: "Review deleted"
        })
    }
    ))
}