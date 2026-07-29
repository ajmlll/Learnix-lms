import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary instance
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'learnix/others';
    let resource_type = 'auto';

    if (file.mimetype.startsWith('image/')) {
      folder = 'learnix/thumbnails';
      resource_type = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'learnix/videos';
      resource_type = 'video';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'learnix/resources';
      resource_type = 'raw';
    }

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}`,
    };
  },
});

export default cloudinary;
