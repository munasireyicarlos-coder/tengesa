require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./server/config/db");
const { router: apiRouter } = require("./server/routes/api");
const mediaRouter = require("./server/routes/media");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, contentSecurityPolicy: false }));
const allowed = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: (origin, cb) => {
  if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
  return cb(new Error("Origin not allowed by CORS"));
} }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 150, standardHeaders: "draft-7", legacyHeaders: false }));
app.use("/api", apiRouter);
app.use("/api", mediaRouter);
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.use((err, req, res, next) => {
  console.error("[server]", err.message);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

connectDB().finally(() => {
  app.listen(PORT, () => console.log(`Tengesa Marketplace running on port ${PORT}`));
});
