const express = require("express");
const router = express.Router();
const Product = require("./Products");
const StockRequest = require("./StockRequest"); // Added

/* ================= ADD PRODUCT ================= */
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= STOCK INWARD ================= */
router.put("/inward/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock = Number(product.stock) + Number(quantity);

    await product.save();

    res.json({
      message: "Stock inward successful",
      product,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= STOCK OUTWARD ================= */
router.put("/outward/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock available",
      });
    }

    // Reduce stock
    product.stock = Number(product.stock) - Number(quantity);

    await product.save();

    /* ===== LOW STOCK CHECK ===== */
    if (product.stock <= product.minStock) {

      const existingRequest = await StockRequest.findOne({
        productName: product.name,
        status: "Pending"
      });

      if (!existingRequest) {
        await StockRequest.create({
          productName: product.name,
          quantity: product.minStock * 2,
          requestedBy: "Warehouse",
          status: "Pending"
        });
      }
    }

    res.json({
      message: "Stock outward successful",
      product,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE PRODUCT ================= */
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE PRODUCT ================= */
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;