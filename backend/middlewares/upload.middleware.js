import multer from "multer";
import path from "path";
import { env } from "../config.js";

const storage = multer.diskStorage({
  destination: `${env.UPLOAD_DIR}/`,

  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`
    );
  },
});


const imageFilter = (req, file, cb) => {
  // Allowed image extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileExt = path.extname(file.originalname).toLowerCase();

  // Check if mimetype starts with image/ OR if the extension is a known image type
  const isImageMime = file.mimetype && file.mimetype.startsWith("image/");
  const isImageExt = allowedExtensions.includes(fileExt);

  if (isImageMime || isImageExt) {
    return cb(null, true);
  }

  // Remember to pass 'false' to reject the file properly
  cb(new Error("Only image files are allowed."), false);
};

export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: env.MAX_IMAGE_SIZE,
  },
});