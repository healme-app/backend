/** @format */
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import multer, { FileFilterCallback } from "multer";
import predictRoutes from "./routes/predict";
import authRoutes from "./routes/auth";

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/images"); // Ubah destination ke folder yang benar
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded({ extended: true })); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// MULTER
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// STATIC IMAGES
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req: Request, res: Response, next: NextFunction) => {
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

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://sahalnurdin888:VdqXjEbZ5l58gwW6@cluster0.y7olrqd.mongodb.net/results?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
