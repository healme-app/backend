/** @format */

import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import Result from "../models/result";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import generateContentWithLabel from "../services/geminiResponse";
import predictClassification from "../services/inferenceService";

interface AuthenticatedRequest extends Request {
  userId: string;
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

export const createResult = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // VALIDATION
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed, entered data is incorrect."
      ) as any;
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error("No image provided.") as any;
      error.statusCode = 422;
      throw error;
    }
    // REPLACE ALL '\' WITH '/'
    const imageUrl = req.file.path.replace("\\", "/");
    const model = req.app.locals.model;
    const userId = req.userId;

    // Make prediction
    const { confidenceScore, label } = await predictClassification(
      model,
      req.file.path
    );

    const { explanation, firstAidRecommendation } =
      await generateContentWithLabel(label, userId);

    // Create result in db
    const resultDb = new Result({
      result: label,
      explanation: explanation,
      firstAidRecommendation: firstAidRecommendation,
      confidenceScore: confidenceScore,
      imageUrl: imageUrl,
      user: req.userId,
    });

    await resultDb.save();
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("User not found.") as any;
      error.statusCode = 404;
      throw error;
    }

    user.results = user.results || [];
    user.results.push((resultDb._id as any).toString());
    await user.save();

    res.status(201).json({
      message: "Result created successfully!",
      resultDb: resultDb,
      user: { _id: user._id, username: user.username },
    });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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
