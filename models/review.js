const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 3,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;