const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        requestedBy: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending Supplier Approval", "Approved", "Rejected"],
            default: "Pending Supplier Approval",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);
