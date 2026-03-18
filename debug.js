const mongoose = require("mongoose");
const Delivery = require("./models/Delivery");
const Order = require("./models/orders/Order");

async function check() {
    await mongoose.connect("mongodb://localhost:27017/warehouseapp");

    const deliveries = await Delivery.find({});
    console.log("Deliveries in DB:", deliveries);

    const orders = await Order.find({});
    console.log("Orders in DB:", orders);

    process.exit(0);
}

check();
