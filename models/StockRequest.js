const mongoose = require("mongoose");

const stockRequestSchema = new mongoose.Schema(
  {
    productName: String,
    quantity: Number,
    requestedBy: String,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockRequest", stockRequestSchema);