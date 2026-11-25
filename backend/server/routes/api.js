const express = require("express");
const Listing = require("../models/Listing");
const Inquiry = require("../models/Inquiry");
const Subscriber = require("../models/Subscriber");
const { sendInquiryEmails } = require("../utils/mailer");

const router = express.Router();
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ""));

function requireDB(req, res, next) {
  if (require("mongoose").connection.readyState !== 1) return res.status(503).json({ error: "Database is not connected. Configure MONGODB_ATLAS_URI." });
  next();
}
function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_PASSWORD;
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!expected || token !== expected) return res.status(401).json({ error: "Unauthorized" });
  next();
}

router.get("/health", (req, res) => res.json({ ok: true, service: "Tengesa Marketplace API", database: require("mongoose").connection.readyState === 1 ? "connected" : "disconnected" }));

router.get("/listings", requireDB, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.featured === "true") filter.featured = true;
    const listings = await Listing.find(filter).sort({ featured: -1, createdAt: -1 }).limit(60).lean();
    res.json({ listings });
  } catch (e) { next(e); }
});

router.post("/listings", requireAdmin, requireDB, async (req, res, next) => {
  try {
    const { title, category, price, currency = "USD", description = "", imageUrl = "", sellerName, featured = false } = req.body;
    if (!title || !category || price === undefined || !sellerName) return res.status(400).json({ error: "Title, category, price and seller name are required." });
    const listing = await Listing.create({ title, category, price: Number(price), currency, description, imageUrl, sellerName, featured: Boolean(featured) });
    res.status(201).json({ listing });
  } catch (e) { next(e); }
});

router.delete("/listings/:id", requireAdmin, requireDB, async (req, res, next) => {
  try {
    const removed = await Listing.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Listing not found." });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.post("/contact", requireDB, async (req, res, next) => {
  try {
    const { name, email, phone = "", inquiryType, message } = req.body;
    if (!name || !emailOk(email) || !message || !["Buyer Support", "Vendor Onboarding", "Corporate Partnership"].includes(inquiryType)) {
      return res.status(400).json({ error: "Please provide a valid name, email, inquiry type and message." });
    }
    const inquiry = await Inquiry.create({ name, email, phone, inquiryType, message });
    let emailSent = false;
    try { emailSent = await sendInquiryEmails(inquiry); } catch (mailErr) { console.error("[mail] Could not send inquiry emails:", mailErr.message); }
    res.status(201).json({ message: "Your inquiry has been received.", emailSent });
  } catch (e) { next(e); }
});

router.post("/subscribe", requireDB, async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!emailOk(email)) return res.status(400).json({ error: "Enter a valid email address." });
    await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
    res.status(201).json({ message: "Thank you for subscribing." });
  } catch (e) { next(e); }
});

router.get("/inquiries", requireAdmin, requireDB, async (req, res, next) => {
  try { res.json({ inquiries: await Inquiry.find().sort({ createdAt: -1 }).limit(200).lean() }); }
  catch (e) { next(e); }
});
router.delete("/inquiries/:id", requireAdmin, requireDB, async (req, res, next) => {
  try {
    const result = await Inquiry.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Inquiry not found." });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = { router, requireAdmin };
