const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "on_delivery", "offline"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);