import multer from 'multer';
import { storage } from '../config/cloudinary.js';

// File filter validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/mkv',
    'video/webm',
    'application/pdf',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type '${file.mimetype}'. Only images (JPEG/PNG/WEBP), videos (MP4/MKV/WEBM), and PDFs are allowed.`
      ),
      false
    );
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max limit
  },
});

export default upload;
