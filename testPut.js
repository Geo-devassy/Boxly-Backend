const mongoose = require('mongoose');
const Order = require('./models/orders/Order');
const axios = require('axios');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/warehouseapp');
    const order = await Order.findOne({ orderNumber: "ORD-9999" });
    console.log("Found order:", order._id);
    try {
        const res = await axios.put(`http://localhost:5000/api/supplier/orders/${order._id}`, { status: "Delivered" });
        console.log("Put response data:", res.data);
    } catch (err) {
        console.error("Put error:", err.message);
    }
    process.exit(0);
}
test();
