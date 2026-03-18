const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false, // Now optional to support returns
    },
    returnRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReturnRequest",
      required: false, // Optional
    },
    type: {
      type: String,
      enum: ["Delivery", "Return"],
      default: "Delivery",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    status: {
      type: String,
      enum: ["assigned", "in_transit", "delivered", "picked_up", "returned"],
      default: "assigned",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Assignment ||
  mongoose.model("Assignment", assignmentSchema);