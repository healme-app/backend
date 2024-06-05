/** @format */
import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import Result from "../models/result";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  userId?: string;
  file?: Express.Multer.File | undefined;
}

export const getResults = (req: Request, res: Response, next: NextFunction) => {
  Result.find()
    .then((results) => {
      res.status(200).json({
        message: "Fetched posts successfully.",
        results: results,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const createResult = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // VALIDATION
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error(
      "Validation failed, entered data is incorrect."
    );
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error: any = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  /** REPLACE ALL '\' WITH '/' */
  const imageUrl = req.file.path.replace("\\", "/");
  const result = req.body.result;
  const category = req.body.category;
  const explanation = req.body.explanation;
  const suggestion = req.body.suggestion;
  let user: any;
  // Create result in db
  const resultDb = new Result({
    result: result,
    category: category,
    explanation: explanation,
    suggestion: suggestion,
    imageUrl: imageUrl,
    user: req.userId,
  });
  resultDb
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user1) => {
      user = user1;
      user.results.push(resultDb);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Result created successfully!",
        resultDb: resultDb,
        user: { _id: user._id, username: user.username },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getResult = (req: Request, res: Response, next: NextFunction) => {
  const resultId = req.params.resultId;
  Result.findById(resultId)
    .then((result) => {
      if (!result) {
        const error: any = new Error("Could not find result.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Result fetched.",
        result: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const deleteResult = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const resultId = req.params.resultId;
  Result.findById(resultId)
    .then((result) => {
      if (!result) {
        const error: any = new Error("Could not find result.");
        error.statusCode = 404;
        throw error;
      }
      if (result.user.toString() !== req.userId) {
        const error: any = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      //CHECK LOGGED IN USER
      clearImage(result.imageUrl);
      return Result.findByIdAndDelete(resultId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      if (!user) {
        const error: any = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      user.results = user.results?.filter(
        (result: any) => result.toString() !== resultId
      );
      return user?.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted Result." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    console.log("File path:", filePath);
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
};
