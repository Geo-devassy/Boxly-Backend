const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  category: String,
  stock: {
    type: Number,
    default: 0
  },
  minStock: {
    type: Number,
    default: 5   // ← important
  }
});

module.exports = mongoose.model("Product", productSchema);
