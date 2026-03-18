const mongoose = require("mongoose");
const Product = require("./models/Products");

mongoose.connect("mongodb://localhost:27017/warehouseapp")
    .then(async () => {
        console.log("✅ MongoDB Connected for Updating Products");
        try {
            const products = await Product.find({});
            let counter = 0;

            for (let product of products) {
                // Remove "- Model X" from the name
                if (product.name && product.name.includes(" - Model")) {
                    product.name = product.name.split(" - Model")[0];
                }

                // Update productId to P-XXXX format
                const idString = counter.toString().padStart(4, "0");
                product.productId = `P-${idString}`;

                await product.save();
                counter++;
            }
            console.log(`✅ Successfully updated ${counter} products!`);
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });
