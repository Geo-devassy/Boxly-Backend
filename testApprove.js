const mongoose = require('mongoose');
const StockRequest = require('./models/StockRequest');
const Order = require('./models/orders/Order');
const axios = require('axios');

async function approveRequest() {
    await mongoose.connect('mongodb://localhost:27017/warehouseapp');
    const req = await StockRequest.findOne({ productName: "Test Restock Product" });
    console.log("Found request:", req._id);
    try {
        const res = await axios.put(`http://localhost:5000/api/supplier/stock-requests/${req._id}`);
        console.log("Put response data:", res.data);

        const newOrder = await Order.findOne({ productName: "Test Restock Product" });
        console.log("Checking if Order was created:", newOrder);
    } catch (err) {
        console.error("Put error:", err.message);
    }
    process.exit(0);
}
approveRequest();
