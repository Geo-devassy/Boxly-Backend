const mongoose = require('mongoose');
const StockRequest = require('./models/StockRequest');
const Order = require('./models/orders/Order');

async function testStockRequest() {
    await mongoose.connect('mongodb://localhost:27017/warehouseapp');

    // Cleanup
    await StockRequest.deleteMany({ productName: "Test Restock Product" });
    await Order.deleteMany({ productName: "Test Restock Product" });

    // Create pending stock request
    const req = await StockRequest.create({
        productName: "Test Restock Product",
        quantity: 50,
        requestedBy: "Testing System",
        status: "Pending"
    });

    console.log("Created Mock Pending Stock Request:", req._id);
    process.exit(0);
}

testStockRequest();
