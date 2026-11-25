const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "USD", enum: ["USD", "ZWG", "ZAR"] },
  description: { type: String, default: "", maxlength: 2000 },
  imageUrl: { type: String, default: "" },
  sellerName: { type: String, required: true, trim: true, maxlength: 120 },
  featured: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });
module.exports = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
