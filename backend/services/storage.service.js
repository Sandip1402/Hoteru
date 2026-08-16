import cloudinary from "../lib/cloudinary.js";
import fs from 'fs/promises';
import AppError from "../utils/app-error.js";

export const uploadImage = async (file, folder = "general") => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `hoteru/${folder}`,
      resource_type: "image",
    });

    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  } finally {
    console.log("Temp file:", file?.path);

    try {
      await fs.unlink(file.path);
      console.log("✅ Temp file deleted");
    } catch (error) {
      console.error("❌ Failed to delete temp file:", error);
    }
  }
};

export const deleteImage = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result === "ok") {
    return;
  }

  if (result.result === "not found") {
    throw new AppError(404, "Image not found in storage.");
  }

  throw new AppError(400, "Couldn't delete image.");
};