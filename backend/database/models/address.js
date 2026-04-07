const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    // addressId: {
    //   type: Number,
    //   required: true,
    //   unique: true
    // },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    versionKey: false
  }
);

addressSchema.index({ city: 1 }, { name: "idx_address_city" });
addressSchema.index({ state: 1 }, { name: "idx_address_state" });
addressSchema.index({ country: 1 }, { name: "idx_address_country" });
addressSchema.index({ city: 1, state: 1, country: 1 },{ name: "idx_address_city_state_country" });

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;