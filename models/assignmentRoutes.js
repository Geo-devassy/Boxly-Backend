const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");

/* ================= CREATE ASSIGNMENT ================= */
router.post("/", async (req, res) => {
  try {
    const { orderId, returnRequestId, driverId, type } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: "Driver required" });
    }
    if (!orderId && !returnRequestId) {
      return res.status(400).json({ message: "Order or Return Request required" });
    }

    // 🚫 Prevent assigning same item twice
    if (orderId) {
      const existing = await Assignment.findOne({ orderId });
      if (existing) {
        return res.status(400).json({ message: "Order already assigned" });
      }
    } else if (returnRequestId) {
      const existing = await Assignment.findOne({ returnRequestId });
      if (existing) {
        return res.status(400).json({ message: "Return Request already assigned" });
      }
    }

    const newAssignment = new Assignment({
      orderId: orderId || undefined,
      returnRequestId: returnRequestId || undefined,
      driverId,
      type: type || "Delivery",
      status: "assigned",
    });

    await newAssignment.save();

    const populated = await Assignment.findById(newAssignment._id)
      .populate("orderId")
      .populate("returnRequestId")
      .populate("driverId");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL ASSIGNMENTS ================= */
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("driverId")
      .populate("orderId")
      .populate("returnRequestId")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE STATUS ================= */
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status required" });
    }

    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("driverId")
      .populate("orderId")
      .populate("returnRequestId");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE ASSIGNMENT (Optional) ================= */
router.delete("/:id", async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;