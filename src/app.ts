/** @format */

import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import predictRoutes from "./routes/predict";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import loadModel from "./services/loadModel";

dotenv.config();

const app = express();

const storage = multer.memoryStorage();

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/bmp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // application/json

app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/predict", predictRoutes);
app.use("/auth", authRoutes);

app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  }
);

const startServer = async () => {
  try {
    const model = await loadModel();
    app.locals.model = model;

    const port = process.env.PORT || 3000;
    const mongodbUri: string = process.env.MONGODB_URI!;

    await mongoose.connect(mongodbUri);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
