const express = require("express");
const router = express.Router();

const Product = require("./Products");
const StockHistory = require("./StockHistory");
const Order = require("../models/orders/Order"); // ⚠ adjust path if needed
const StockRequest = require("../models/StockRequest");
const Delivery = require("../models/Delivery");

/* ================= SUPPLIER DASHBOARD ================= */

router.get("/dashboard", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const inwardCount = await StockHistory.countDocuments({
      type: "INWARD",
    });

    const outwardCount = await StockHistory.countDocuments({
      type: "OUTWARD",
    });

    res.json({
      totalProducts,
      inwardCount,
      outwardCount,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= SUPPLIER ORDERS ================= */

// ✅ GET all supplier orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (updatedOrder && (req.body.status === "Delivered" || req.body.status === "In Transit")) {
      const existingDelivery = await Delivery.findOne({ orderId: updatedOrder.orderId });
      if (existingDelivery) {
        existingDelivery.status = req.body.status;
        if (req.body.status === "Delivered") {
          existingDelivery.deliveryDate = new Date();
        }
        await existingDelivery.save();
      } else {
        const newDelivery = new Delivery({
          orderId: updatedOrder.orderId,
          productName: updatedOrder.productName,
          quantity: updatedOrder.quantity,
          status: req.body.status,
          deliveryDate: req.body.status === "Delivered" ? new Date() : null
        });
        await newDelivery.save();
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET all deliveries
router.get("/deliveries", async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all stock requests
router.get("/stock-requests", async (req, res) => {
  try {
    const requests = await StockRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new manual stock request
router.post("/stock-requests", async (req, res) => {
  try {
    const { productName, quantity, requestedBy } = req.body;

    // Check if there is already a pending request for this product
    const existing = await StockRequest.findOne({ productName, status: "Pending" });
    if (existing) {
      return res.status(400).json({ message: "A pending stock request already exists for this product" });
    }

    const newRequest = new StockRequest({
      productName,
      quantity,
      requestedBy: requestedBy || "Admin",
      status: "Pending"
    });

    await newRequest.save();
    res.json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject request
router.put("/stock-requests/:id", async (req, res) => {
  try {
    const { status } = req.body; // Expect "Approved" or "Rejected"

    // Default to "Approved" if no status provided for backwards compatibility
    const finalStatus = status || "Approved";

    const updatedRequest = await StockRequest.findByIdAndUpdate(
      req.params.id,
      { status: finalStatus },
      { new: true }
    );

    if (updatedRequest && updatedRequest.status === "Approved") {
      // 1. Check if we already created an order for this request (optional safety, but let's just create one)
      // We will generate a new OrderNumber
      const timestamp = Date.now();
      const newOrderNumber = `ORD-${timestamp}`;

      // Attempt to parse out a numeric ID from orderNumber or generate a timestamp based one
      const newOrderId = timestamp % 1000000;

      // 2. Create the order
      const newOrder = new Order({
        orderId: newOrderId,
        productName: updatedRequest.productName,
        quantity: updatedRequest.quantity,
        customer: updatedRequest.requestedBy || "System",
        total: 0, // Stock request might not define a total price
        status: "Pending",
        orderNumber: newOrderNumber,
      });

      await newOrder.save();
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error("DEBUG ERROR in PUT /stock-requests/:id:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;