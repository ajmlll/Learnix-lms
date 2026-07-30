import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { createCloudinaryStorage } from '../config/cloudinary.js';

// Ensure upload folders exist locally
const uploadDirs = ['uploads/thumbnails', 'uploads/videos', 'uploads/resources', 'uploads/others'];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Try Cloudinary storage first; if unconfigured, fallback to diskStorage
let storageEngine = createCloudinaryStorage();

if (!storageEngine) {
  storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      let dest = 'uploads/others';
      if (file.mimetype.startsWith('image/')) dest = 'uploads/thumbnails';
      else if (file.mimetype.startsWith('video/')) dest = 'uploads/videos';
      else if (file.mimetype === 'application/pdf') dest = 'uploads/resources';
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
      cb(null, `${Date.now()}_${name}${ext}`);
    },
  });
}

// File filter validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/mkv',
    'video/webm',
    'video/quicktime',
    'video/avi',
    'video/x-msvideo',
    'video/3gpp',
    'application/pdf',
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type '${file.mimetype}'. Allowed types: images (JPEG/PNG/WEBP), videos (MP4/MKV/WEBM/MOV), and PDFs.`
      ),
      false
    );
  }
};

export const upload = multer({
  storage: storageEngine,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB limit
  },
});

export default upload;
