const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingCode: { 
    type: Number, 
    required: true, 
    unique: true
  },
  userId: {
    type: Number,
    required: true,
    index: true
  },
  roomId: { 
    type: Number, 
    required: true, 
    index: true 
  },
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date, 
    required: true 
  },
  guests: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  price: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
}, { versionKey: false });

bookingSchema.index({ userId: 1, createdAt: 1 }, { name: "idx_bookings_user_created" });
bookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 }, { name: "idx_bookings_room_dates" });
bookingSchema.index({ checkIn: 1, checkOut: 1 }, { name: "idx_bookings_dates" });
bookingSchema.index({ createdAt: 1 }, { name: "idx_bookings_created_at" });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;