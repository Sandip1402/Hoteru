const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true
    },
    roomId: {
      type: Number,
      required: true
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

likeSchema.index(
  { userId: 1, roomId: 1 },
  { unique: true, name: "pk_likes" }
);

likeSchema.index({ roomId: 1 }, { name: "idx_likes_room" });
likeSchema.index({ userId: 1, createdAt: 1 },{ name: "idx_likes_user_created" });

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;