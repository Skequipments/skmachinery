
import { GridFSBucket, ObjectId } from 'mongodb';
import { getDB } from '@/config/db';

export const getImageStream = async (imageId: string) => {
  const db = getDB();
  const bucket = new GridFSBucket(db, { bucketName: 'productImages' });
  return bucket.openDownloadStream(new ObjectId(imageId));
};

export const saveImage = async (file: Buffer, filename: string, contentType: string) => {
  const db = getDB();
  const bucket = new GridFSBucket(db, { bucketName: 'productImages' });
  return bucket.openUploadStream(filename, { contentType });
};
