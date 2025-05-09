import { cloudinary } from "../utils/cloudinary.js";

const uploadToCloudinary = async (filePath) => {
  try {
    const res = await cloudinary.uploader.upload(filePath);
    return {
      url: res.secure_url,
    };
  } catch (error) {
    throw new Error("Error while uploading image");
  }
};

export { uploadToCloudinary };
