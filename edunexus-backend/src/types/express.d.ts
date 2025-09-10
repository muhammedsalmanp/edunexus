// src/types/express.d.ts
import { BaseUserEntity } from '../domain/entities/UserEntity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: BaseUserEntity;
  }
}

import { Express } from 'express';

declare module 'express' {
  interface Request {
    file?: Express.Multer.File & { key?: string; signedUrl?: string; publicUrl?: string };
    files?: (Express.Multer.File & { key?: string; signedUrl?: string; publicUrl?: string })[] | { [fieldname: string]: (Express.Multer.File & { key?: string; signedUrl?: string; publicUrl?: string })[] };
  }
}