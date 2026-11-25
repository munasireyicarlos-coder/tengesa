const mongoose = require("mongoose");
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
  phone: { type: String, default: "", trim: true, maxlength: 40 },
  inquiryType: { type: String, required: true, enum: ["Buyer Support", "Vendor Onboarding", "Corporate Partnership"] },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ["New", "In Progress", "Closed"], default: "New" }
}, { timestamps: { createdAt: true, updatedAt: false } });
module.exports = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
