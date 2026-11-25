const express = require("express");
const { getImageKit } = require("../config/imagekit");
const { requireAdmin } = require("./api");
const router = express.Router();

router.get("/imagekit-auth", requireAdmin, (req, res) => {
  const imagekit = getImageKit();
  if (!imagekit) return res.status(503).json({ error: "ImageKit is not configured." });
  res.json({
    ...imagekit.getAuthenticationParameters(),
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  });
});
module.exports = router;
