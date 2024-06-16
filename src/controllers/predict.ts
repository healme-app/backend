/** @format */

import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import Result from "../models/result";
import User from "../models/user";
import generateContentWithLabel from "../services/geminiResponse";
import predictClassification from "../services/inferenceService";
import { Request, Response, NextFunction } from "express";

export const getResults = (req: Request, res: Response, next: NextFunction) => {
  Result.find()
    .then((results) => {
      res.status(200).json({
        error: false,
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
  req: Request,
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

    const imageUrl = (req.file as any).cloudStoragePublicUrl;
    console.log(imageUrl);

    const { model } = req.app.locals;

    // Make prediction using the image URL
    const { confidenceScore, label } = await predictClassification(
      model,
      imageUrl
    );

    const userId = (req as any).userId;
    // const { explanation, firstAidRecommendation } =
    //   await generateContentWithLabel(label, userId);

    // Create result in db
    const resultDb = new Result({
      result: label,
      // explanation: explanation,
      // firstAidRecommendation: firstAidRecommendation,
      confidenceScore: confidenceScore,
      imageUrl: imageUrl,
      user: userId,
    });

    await resultDb.save();
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.") as any;
      error.statusCode = 404;
      throw error;
    }
    (user.results as any)?.push(resultDb);
    await user.save();
    res.status(201).json({
      error: false,
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
        const error = new Error("Could not find result.") as any;
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ error: false, message: "Result fetched.", result: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const deleteResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resultId = req.params.resultId;
  Result.findById(resultId)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find result.") as any;
        error.statusCode = 404;
        throw error;
      }
      if (result.user.toString() !== (req as any).userId) {
        const error = new Error("Not authorized!") as any;
        error.statusCode = 403;
        throw error;
      }

      // Remove result from database
      return Result.findByIdAndDelete(resultId);
    })
    .then((result) => {
      // Remove result from user's results array
      return User.findById((req as any).userId);
    })
    .then((user) => {
      (user?.results as any)?.pull(resultId);
      return user?.save();
    })
    .then((result) => {
      res.status(200).json({ error: false, message: "Deleted Result." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
