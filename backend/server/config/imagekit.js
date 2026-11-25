const ImageKit = require("imagekit");

function getImageKit() {
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) return null;
  return new ImageKit({ publicKey: IMAGEKIT_PUBLIC_KEY, privateKey: IMAGEKIT_PRIVATE_KEY, urlEndpoint: IMAGEKIT_URL_ENDPOINT });
}
module.exports = { getImageKit };
