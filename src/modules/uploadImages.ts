/** @format */

import { Request, Response, NextFunction } from "express";
import { Storage } from "@google-cloud/storage";
import path from "path";

interface MulterFile extends Express.Multer.File {
  buffer: Buffer;
  cloudStorageError?: Error;
  cloudStorageObject?: string;
  cloudStoragePublicUrl?: string;
}

const pathKey = path.resolve("./serviceaccountkey.json");

// TODO: Adjust Storage configuration
const gcs = new Storage({
  projectId: "healme-424720",
  keyFilename: pathKey,
});

// TODO: Add the bucket name used
const bucketName = "healme-image-upload";
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename: string): string {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

const ImgUpload: any = {};

ImgUpload.uploadToGcs = (req: Request, res: Response, next: NextFunction) => {
  const multerFile = req.file as MulterFile;

  if (!multerFile) return next();

  const gcsname =
    new Date().toISOString().replace(/[-:.]/g, "") +
    path.extname(multerFile.originalname);

  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: multerFile.mimetype,
    },
  });

  stream.on("error", (err) => {
    multerFile.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", () => {
    multerFile.cloudStorageObject = gcsname;
    multerFile.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  if (multerFile.buffer) {
    stream.end(multerFile.buffer);
  } else {
    next(new Error("File buffer is missing."));
  }
};

export default ImgUpload;
