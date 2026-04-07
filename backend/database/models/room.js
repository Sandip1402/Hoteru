const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    // roomId: {
    //   type: Number,
    //   required: true,
    //   unique: true
    // },
    addressId: {
      type: Number,
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["hotel", "pg", "guesthouse", "flat"]
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    desc: {
      type: String,
      required: true,
      trim: true
    },
    guests: {
      type: Number,
      required: true,
      min: 1
    },
    beds: {
      type: Number,
      required: true,
      min: 0
    },
    baths: {
      type: Number,
      required: true,
      min: 0
    },
    avgRating: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0.0
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    versionKey: false
  }
);

roomSchema.index({ addressId: 1 }, { name: "idx_rooms_address" });
roomSchema.index({ type: 1 }, { name: "idx_rooms_type" });
roomSchema.index({ price: 1 }, { name: "idx_rooms_price" });
roomSchema.index({ guests: 1 }, { name: "idx_rooms_guest" });
roomSchema.index({ avgRating: 1 }, { name: "idx_rooms_rating" });
roomSchema.index({ type: 1, price: 1, guests: 1 }, { name: "idx_rooms_filter_main" });
roomSchema.index({ addressId: 1, type: 1, price: 1 }, { name: "idx_rooms_address_type_price" });
roomSchema.index({ createdAt: 1 }, { name: "idx_rooms_created_at" });

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;