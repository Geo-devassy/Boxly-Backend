const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/* ================= STOCK HISTORY SCHEMA ================= */

const stockHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Inward", "Outward"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },

  // ✅ NEW FIELDS
  staffName: {
    type: String,
    default: "",
  },
  remarks: {
    type: String,
    default: "",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

/* Force collection name */
const StockHistory = mongoose.model(
  "StockHistory",
  stockHistorySchema,
  "stockhistory"
);

/* ================= GET ALL HISTORY ================= */

router.get("/", async (req, res) => {
  try {
    const history = await StockHistory.find()
      .populate("productId")
      .sort({ date: -1 });

    res.json(history);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= ADD HISTORY ================= */

router.post("/", async (req, res) => {
  try {
    const { type, productId, quantity, staffName, remarks } = req.body;

    if (!type || !productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const record = new StockHistory({
      type,
      productId,
      quantity,
      staffName,
      remarks,
    });

    await record.save();
    res.json(record);
  } catch (err) {
    console.error("History save error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE HISTORY ================= */

router.delete("/:id", async (req, res) => {
  try {
    await StockHistory.findByIdAndDelete(req.params.id);
    res.json({ message: "History deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;