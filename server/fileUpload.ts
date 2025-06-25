import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    } catch (error) {
      cb(error, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  }
});

// File filter for security
const fileFilter = (req: any, file: any, cb: any) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, documents, and zip files are allowed.'), false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 files per upload
  }
});

// Image processing function
export async function processImage(filePath: string, options: {
  width?: number;
  height?: number;
  quality?: number;
} = {}): Promise<string> {
  const { width = 800, height = 600, quality = 80 } = options;
  
  const ext = path.extname(filePath);
  const processedPath = filePath.replace(ext, `_processed${ext}`);

  await sharp(filePath)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality })
    .toFile(processedPath);

  return processedPath;
}

// File validation
export function validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  return { valid: true };
}

// Clean up old files (run periodically)
export async function cleanupOldFiles(maxAgeHours: number = 24): Promise<number> {
  try {
    const files = await fs.readdir(uploadsDir);
    const now = Date.now();
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = await fs.stat(filePath);
      const ageHours = (now - stats.mtime.getTime()) / (1000 * 60 * 60);

      if (ageHours > maxAgeHours) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }

    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up files:', error);
    return 0;
  }
}

// Get file info
export async function getFileInfo(filename: string) {
  const filePath = path.join(uploadsDir, filename);
  
  try {
    const stats = await fs.stat(filePath);
    return {
      filename,
      size: stats.size,
      mtime: stats.mtime,
      exists: true
    };
  } catch (error) {
    return {
      filename,
      exists: false
    };
  }
}

// File type detection
export function getFileCategory(mimetype: string): string {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
  if (mimetype.includes('zip')) return 'archive';
  return 'other';
}

export interface FileMetadata {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
  projectId?: string;
  description?: string;
}