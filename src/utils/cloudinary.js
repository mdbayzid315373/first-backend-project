import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided for upload.");
      return null;
    }

    // Upload the file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Remove temp file after success
    fs.unlinkSync(localFilePath);

    console.log("✅ File uploaded to Cloudinary:", response.secure_url);
    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);

    // Remove temp file if exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
