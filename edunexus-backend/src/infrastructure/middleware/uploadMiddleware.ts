
import multer, { MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { uploadFileToS3 } from '../storage/s3Storage';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 12,
    fields: 50,
  },
  fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const allowedTypes: { [key: string]: string[] } = {
      profilePic: ['image/jpeg', 'image/png', 'image/jpg'],
      certificates: ['image/jpeg', 'image/png', 'image/jpg'],
      thumbnail: ['image/jpeg', 'image/png', 'image/jpg'],
      video: ['video/mp4', 'video/mpeg', 'video/quicktime'],
      chapters: ['video/mp4', 'video/mpeg', 'video/quicktime'],
    };

    const fieldName = file.fieldname;
    const mimeType = file.mimetype;

    if (allowedTypes[fieldName] && allowedTypes[fieldName].includes(mimeType)) {
      callback(null, true);
    } else {
      callback(new Error(`Invalid file type for ${fieldName}. Allowed types: ${allowedTypes[fieldName]?.join(', ') || 'none'}`));
    }
  },
});

export const uploadTeacherFiles = [
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'certificates', maxCount: 10 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const profilePic = files?.['profilePic']?.[0];
      if (profilePic) {
        const result = await uploadFileToS3('teacher/profiles/', profilePic);
        req.file = { ...profilePic, ...result } as Express.Multer.File & { key: string; signedUrl: string; publicUrl?: string };
      }

      const certificates = files?.['certificates'] || [];
      if (certificates.length > 0) {
        const results = await Promise.all(certificates.map(file => uploadFileToS3('teacher/certificates/', file)));
        req.files = certificates.map((file, index) => ({
          ...file,
          ...results[index],
        })) as (Express.Multer.File & { key: string; signedUrl: string; publicUrl?: string })[];
      }

      next();
    } catch (err) {
      console.error('Upload Error:', err instanceof Error ? err.message : String(err));
      res.status(400).json({ error: err instanceof Error ? err.message : 'Upload failed' });
    }
  },
];

export const uploadCourseMedia = [
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'chapters', maxCount: 10 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const thumbnail = files?.['thumbnail']?.[0];
      if (thumbnail) {
        const thumbnailResult = await uploadFileToS3('thumbnails/', thumbnail, true);
        req.body.thumbnailImage = thumbnailResult.publicUrl;
      }

      const chapterFiles = files?.['chapters'] || [];
      if (chapterFiles.length > 0) {
        const videoResults = await Promise.all(chapterFiles.map(file => uploadFileToS3('videos/', file, false)));
        req.body.chapterVideos = videoResults.map(result => result.signedUrl);
      }

      next();
    } catch (err) {
      console.error('Upload Error:', err instanceof Error ? err.message : String(err));
      res.status(400).json({ error: err instanceof Error ? err.message : 'Upload failed' });
    }
  },
];

export { upload };