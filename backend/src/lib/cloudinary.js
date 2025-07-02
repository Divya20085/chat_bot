import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

// Debug: Check if environment variables are loaded
console.log("Cloudinary config check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Not set",
  api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Not set",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set"
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
