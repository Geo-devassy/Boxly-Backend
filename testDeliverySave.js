const mongoose = require('mongoose');
const Delivery = require('./models/Delivery');

async function test() {
    await mongoose.connect('mongodb://localhost:27017/warehouseapp');
    try {
        const newDelivery = new Delivery({
            orderId: '9999',
            productName: 'Test Product',
            quantity: 1,
            status: 'Delivered',
            deliveryDate: new Date()
        });

        await newDelivery.save();
        console.log("Saved normally:", newDelivery);
    } catch (err) {
        console.error("Save error:", err);
    }
    process.exit(0);
}
test();
