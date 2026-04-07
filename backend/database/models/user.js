// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    auth0Id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      trim: true,
    },
    firstname: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    lastname: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    DOB: Date,
    isAdult: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      trim: true,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, name: "idx_users_email_unique" });
userSchema.index({ country: 1 }, { name: "idx_users_country" });
userSchema.index({ createdAt: 1 }, { name: "idx_users_created_at" });
userSchema.index({ auth0Id: 1 }, { unique: true, name: "idx_users_auth0id_unique" });

const User = mongoose.model('User', userSchema);
module.exports = User;