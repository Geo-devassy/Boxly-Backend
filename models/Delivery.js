const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    orderId: String,
    productName: String,
    quantity: Number,
    deliveryDate: Date,
    status: {
      type: String,
      enum: ["In Transit", "Delivered"],
      default: "In Transit",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);