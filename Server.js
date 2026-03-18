require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose.connect("mongodb://localhost:27017/warehouseapp")
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("Connected DB:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

/* ================= ROUTES ================= */

// USERS
const userRoutes = require("./models/userRoutes");
app.use("/api/users", userRoutes);

// PRODUCTS
const productRoutes = require("./models/productRoutes");
app.use("/api/products", productRoutes);

// STOCK HISTORY
const stockHistoryRoutes = require("./models/stockHistoryRoutes");
app.use("/api/stockhistory", stockHistoryRoutes);

// ORDERS ✅ FIXED PATH
const ordersRoutes = require("./models/orders/orderRoutes");
app.use("/api/orders", ordersRoutes);

// RETURN REQUESTS
const returnRequestRoutes = require("./models/returnRequestRoutes");
app.use("/api/returnrequests", returnRequestRoutes);

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("🚀 Boxly Backend Running Successfully");
});

/* ================= SUPPLIER ROUTES ================= */
const driverRoutes = require("./models/driverRoutes");
app.use("/api/drivers", driverRoutes);

/* ================= ASSIGNMENT ROUTES ================= */
const assignmentRoutes = require("./models/assignmentRoutes");
app.use("/api/assignments", assignmentRoutes);

const supplierRoutes = require("./models/supplierRoutes");
app.use("/api/supplier", supplierRoutes);

/* ================= SERVER ================= */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});

