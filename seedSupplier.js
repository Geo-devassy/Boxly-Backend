const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    otp: String,
    otpExpires: Date,
    isVerified: Boolean,
});
const User = mongoose.model("User", userSchema);

const orderSchema = new mongoose.Schema({
    orderId: Number,
    productName: String,
    customer: String,
    total: Number,
    status: { type: String, default: "Pending" },
    orderNumber: { type: String, unique: true },
}, { timestamps: true });
const Order = mongoose.model("Order", orderSchema, "orders");

async function seed() {
    await mongoose.connect("mongodb://localhost:27017/warehouseapp");

    const hashedPassword = await bcrypt.hash("password", 10);
    await User.deleteOne({ username: "testsupplier" });
    await User.create({
        username: "testsupplier",
        email: "supplier@test.com",
        password: hashedPassword,
        role: "supplier",
        isVerified: true
    });

    await Order.deleteOne({ orderNumber: "ORD-9999" });
    await Order.create({
        orderId: 9999,
        productName: "Test Product",
        customer: "Test Customer",
        total: 100,
        status: "Pending",
        orderNumber: "ORD-9999"
    });

    console.log("Seeded supplier and order");
    process.exit(0);
}

seed();
