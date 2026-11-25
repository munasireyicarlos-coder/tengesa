const mongoose = require("mongoose");
const Listing = require("../models/Listing");

const sampleListings = [
  { title: "Apple iPhone 13 Pro", category: "Phones & Tablets", price: 340, currency: "USD", description: "Example listing. Contact the seller to confirm condition and availability.", imageUrl: "https://images.unsplash.com/photo-1632633173522-6f5b1b6b1b8d?auto=format&fit=crop&w=900&q=80", sellerName: "Demo Electronics", featured: true },
  { title: "Modern Office Chair", category: "Home & Office", price: 85, currency: "USD", description: "Ergonomic office chair sample listing.", imageUrl: "https://images.unsplash.com/photo-1505843490701-5be5d0b4b6a5?auto=format&fit=crop&w=900&q=80", sellerName: "Office Hub", featured: true },
  { title: "Fresh Produce Supply", category: "Agriculture", price: 25, currency: "USD", description: "Sample bulk produce listing. Final price depends on quantity.", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80", sellerName: "Green Harvest", featured: true },
  { title: "Construction Materials", category: "Building & Hardware", price: 12, currency: "USD", description: "Sample building materials listing.", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80", sellerName: "BuildSmart Supplies", featured: false }
];

async function connectDB() {
  const uri = process.env.MONGODB_ATLAS_URI;
  if (!uri) {
    console.warn("[database] MONGODB_ATLAS_URI is not configured; database features are disabled.");
    return false;
  }
  mongoose.connection.on("connected", () => console.log("[database] MongoDB Atlas connected"));
  mongoose.connection.on("error", (err) => console.error("[database] MongoDB error:", err.message));
  mongoose.connection.on("disconnected", () => console.warn("[database] MongoDB disconnected"));

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10 });
    if (await Listing.countDocuments() === 0) {
      await Listing.insertMany(sampleListings);
      console.log("[database] Seeded four sample Tengesa listings");
    }
    return true;
  } catch (err) {
    console.error("[database] Initial connection failed:", err.message);
    return false;
  }
}

module.exports = { connectDB, mongoose };
