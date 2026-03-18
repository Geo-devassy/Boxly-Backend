const express = require("express");
const router = express.Router();
const Order = require("../orders/Order");

/* GET ALL ORDERS */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ADD ORDER */
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      orderNumber: `ORD-${Date.now()}`,
    });

    await newOrder.save();

    res.json({ message: "Order added", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE STATUS */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ message: "Updated", order: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE ORDER */
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;