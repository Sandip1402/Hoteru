const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // reviewId: {
    //   type: Number,
    //   required: true,
    //   unique: true
    // },
    roomId: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

reviewSchema.index({ userId: 1 }, { name: "idx_reviews_user" });
reviewSchema.index({ roomId: 1 }, { name: "idx_reviews_room" });
reviewSchema.index({ roomId: 1, createdAt: 1 },{ name: "idx_reviews_room_created" });
reviewSchema.index({ rating: 1 }, { name: "idx_reviews_rating" });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;