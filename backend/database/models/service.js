const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    roomId: {
      type: Number,
      required: true
    },
    service: {
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

serviceSchema.index({ roomId: 1, service: 1 }, { unique: true, name: "pk_services" });
serviceSchema.index({ service: 1 }, { name: "idx_services_service" });

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;