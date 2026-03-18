const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Inward", "Outward"] // safer than uppercase
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",   // MUST match your Product model name
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
   staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  staffName: {
    type: String
  },
  remarks: {
    type: String,
    default: ""
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports =
  mongoose.models.StockHistory ||
  mongoose.model("StockHistory", stockHistorySchema);