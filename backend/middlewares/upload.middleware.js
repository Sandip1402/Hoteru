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
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  cb(new Error("Only image files are allowed."));
};

export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: env.MAX_IMAGE_SIZE,
  },
});