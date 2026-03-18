const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: Number,
  productName: String,
  quantity: Number,
  customer: String,
  total: Number,
  status: {
    type: String,
    default: "Pending"
  },
  orderNumber: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema, "orders");
