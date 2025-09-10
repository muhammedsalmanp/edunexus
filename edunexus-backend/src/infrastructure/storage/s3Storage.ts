// import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
// import { Upload } from '@aws-sdk/lib-storage';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import crypto from 'crypto';
// import { Readable } from 'stream';
// import { s3Client } from '../config/s3Config';

// const bucketName = process.env.AWS_BUCKET_NAME || '';

// // Upload file to S3 and return key, public URL, and signed URL
// export async function uploadFileToS3(folderPath: string, file: Express.Multer.File) {
//   // Generate a unique file name
//   const uniqueName = crypto.randomBytes(16).toString('hex');
//   const extension = file.mimetype.split('/')[1] || 'jpg'; // Default to jpg if mime type is invalid
//   const fileName = `${folderPath}/${uniqueName}.${extension}`;

//   // Convert buffer to readable stream
//   const stream = Readable.from(file.buffer);

//   // Upload to S3
//   const upload = new Upload({
//     client: s3Client,
//     params: {
//       Bucket: bucketName,
//       Key: fileName,
//       Body: stream,
//       ContentType: file.mimetype,
//       ACL: 'private', // Files are private, accessed via signed URLs
//     },
//   });

//   await upload.done();

//   // Generate signed URL (expires in 1 hour)
//   const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
//     Bucket: bucketName,
//     Key: fileName,
//   }), { expiresIn: 3600 });

//   // Public URL (optional, but since ACL is private, use signed URL for access)
//   const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

//   return {
//     key: fileName,
//     signedUrl, // Use this for secure access
//     publicUrl, // For reference, though ACL is private
//   };
// }

// // Delete file from S3
// export async function deleteFileFromS3(key: string) {
//   const command = new DeleteObjectCommand({
//     Bucket: bucketName,
//     Key: key,
//   });

//   await s3Client.send(command);
// }

// import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
// import { Upload } from '@aws-sdk/lib-storage';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import crypto from 'crypto';
// import { Readable } from 'stream';
// import { s3Client } from '../config/s3Config';
// import { Express } from 'express'; // For Multer File type

// const bucketName = process.env.AWS_BUCKET_NAME || '';

// if (!bucketName) {
//   throw new Error('AWS_BUCKET_NAME is not defined in environment variables');
// }

// export async function uploadFileToS3(folderPath: string, file: Express.Multer.File, isPublic: boolean = false) {
//   try {
//     // Generate a unique file name
//     const uniqueName = crypto.randomBytes(16).toString('hex');
//     const extension = file.mimetype.split('/')[1] || (file.mimetype === 'image/jpeg' ? 'jpg' : 'mp4'); // Default to mp4 for videos
//     const fileName = `${folderPath}${uniqueName}.${extension}`;

//     // Convert buffer to readable stream
//     const stream = Readable.from(file.buffer);

//     // Upload to S3
//     const upload = new Upload({
//       client: s3Client,
//       params: {
//         Bucket: bucketName,
//         Key: fileName,
//         Body: stream,
//         ContentType: file.mimetype,
//         ACL: isPublic ? 'public-read' : 'private', // Set ACL based on isPublic flag
//       },
//     });

//     await upload.done();

//     // Generate URLs
//     const signedUrl = await getSignedUrl(
//       s3Client,
//       new GetObjectCommand({
//         Bucket: bucketName,
//         Key: fileName,
//       }),
//       { expiresIn: 3600 } // 1 hour expiration for signed URL
//     );

//     const publicUrl = isPublic ? `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}` : '';

//     return {
//       key: fileName,
//       signedUrl,
//       publicUrl,
//     };
//   } catch (error) {
//     console.error('S3 Upload Error:', error);
//     throw new Error(`Failed to upload file to S3: ${error}`);
//   }
// }

// export async function deleteFileFromS3(key: string) {
//   try {
//     const command = new DeleteObjectCommand({
//       Bucket: bucketName,
//       Key: key,
//     });
//     await s3Client.send(command);
//   } catch (error) {
//     console.error('S3 Delete Error:', error);
//     throw new Error(`Failed to delete file from S3: ${error}`);
//   }
// }

// src/infrastructure/storage/s3Storage.ts
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { Readable } from 'stream';
import { s3Client } from '../config/s3Config';
import { Express } from 'express';

const bucketName = process.env.AWS_BUCKET_NAME || '';

if (!bucketName) {
  throw new Error('AWS_BUCKET_NAME is not defined in environment variables');
}

export async function uploadFileToS3(folderPath: string, file: Express.Multer.File, isPublic: boolean = false) {
  try {
    // Generate a unique file name
    const uniqueName = crypto.randomBytes(16).toString('hex');
    const extension = file.mimetype.split('/')[1] || (file.mimetype === 'image/jpeg' ? 'jpg' : 'mp4');
    const fileName = `${folderPath}${uniqueName}.${extension}`;

    // Convert buffer to readable stream
    const stream = Readable.from(file.buffer);

    // Upload to S3 without ACL
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: fileName,
        Body: stream,
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    // Generate signed URL (1 hour expiration)
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      }),
      { expiresIn: 3600 }
    );

    // Public URL only for public files (e.g., thumbnails)
    const publicUrl = isPublic ? `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}` : '';

    return {
      key: fileName,
      signedUrl,
      publicUrl,
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function deleteFileFromS3(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error('S3 Delete Error:', error);
    throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : String(error)}`);
  }
}