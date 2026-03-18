const mongoose = require("mongoose");
const Product = require("./models/Products"); // Adjust path if needed
require("dotenv").config();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/warehouseapp")
    .then(() => console.log("✅ MongoDB Connected for Seeding Products"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

const categories = {
    "Electronics": ["Laptops", "Mobile Phones", "Chargers", "Monitors", "Keyboards"],
    "Office Supplies": ["Pens", "Notebooks", "Printer Paper", "Staplers", "Files"],
    "Furniture": ["Office Chairs", "Tables", "Cabinets", "Shelves", "Desks"],
    "Packaging Materials": ["Carton Boxes", "Bubble Wrap", "Packing Tape", "Labels", "Plastic Wrap"],
    "Accessories": ["Mouse", "USB Drives", "Adapters", "Headphones", "Cables"]
};

// Function to generate a random product name
const generateProductName = (category, type) => {
    const brands = ["Pro", "Max", "Ultra", "Basic", "Standard", "Elite", "Premium", "Eco", "Smart", "Compact"];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    return `${randomBrand} ${type}`;
};

const generateProducts = () => {
    const products = [];
    const categoryKeys = Object.keys(categories);
    const numProducts = 200;

    for (let i = 0; i < numProducts; i++) {
        const category = categoryKeys[i % categoryKeys.length];
        const types = categories[category];
        const type = types[Math.floor(Math.random() * types.length)];

        const stock = Math.floor(Math.random() * 500) + 50; // Random stock between 50 and 550
        const minStock = Math.floor(Math.random() * 50) + 10;

        const idString = i.toString().padStart(4, "0");
        products.push({
            productId: `P-${idString}`,
            name: generateProductName(category, type),
            category: category,
            stock: stock,
            minStock: minStock
        });
    }
    return products;
};

const seedDatabase = async () => {
    try {
        console.log("Deleting existing products... (Optional: Uncomment next line if you want to clear first)");
        // await Product.deleteMany({}); 

        const productsToInsert = generateProducts();

        console.log(`Inserting ${productsToInsert.length} products...`);
        await Product.insertMany(productsToInsert);

        console.log("✅ Successfully seeded 200 products!");
    } catch (error) {
        console.error("❌ Error seeding products:", error);
    } finally {
        mongoose.disconnect();
    }
};

seedDatabase();
