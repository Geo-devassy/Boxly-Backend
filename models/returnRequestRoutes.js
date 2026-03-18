const express = require("express");
const router = express.Router();
const ReturnRequest = require("./ReturnRequest");

// Create a new return request (Staff)
router.post("/", async (req, res) => {
    try {
        const { productName, quantity, reason, requestedBy } = req.body;
        const newReturn = new ReturnRequest({
            productName,
            quantity,
            reason,
            requestedBy,
        });
        await newReturn.save();
        res.status(201).json(newReturn);
    } catch (error) {
        res.status(500).json({ message: "Error creating return request", error });
    }
});

// Get all return requests (Staff & Supplier)
router.get("/", async (req, res) => {
    try {
        const returns = await ReturnRequest.find().sort({ createdAt: -1 });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ message: "Error fetching return requests", error });
    }
});

// Approve a return request (Supplier)
router.put("/:id/approve", async (req, res) => {
    try {
        const returnReq = await ReturnRequest.findByIdAndUpdate(
            req.params.id,
            { status: "Approved" },
            { new: true }
        );
        if (!returnReq) return res.status(404).json({ message: "Request not found" });
        res.status(200).json(returnReq);
    } catch (error) {
        res.status(500).json({ message: "Error approving request", error });
    }
});

// Reject a return request (Supplier)
router.put("/:id/reject", async (req, res) => {
    try {
        const returnReq = await ReturnRequest.findByIdAndUpdate(
            req.params.id,
            { status: "Rejected" },
            { new: true }
        );
        if (!returnReq) return res.status(404).json({ message: "Request not found" });
        res.status(200).json(returnReq);
    } catch (error) {
        res.status(500).json({ message: "Error rejecting request", error });
    }
});

module.exports = router;
