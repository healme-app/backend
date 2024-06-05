/** @format */

import express from "express";
import { body } from "express-validator";
import {
  getResults,
  createResult,
  getResult,
  deleteResult,
} from "../controllers/predict";
import isAuth from "../middleware/is-auth";

const router = express.Router();

// GET /predict/results
router.get("/results", isAuth, getResults);

// POST /predict/result
router.post(
  "/result",
  isAuth,
  [
    body("result").trim().isLength({ min: 5 }),
    body("explanation").trim().isLength({ min: 5 }),
    body("suggestion").trim().isLength({ min: 5 }),
  ],
  createResult
);

// GET /predict/result/resultId
router.get("/result/:resultId", isAuth, getResult);

// DELETE /predict/result/resultId
router.delete("/result/:resultId", isAuth, deleteResult);

export default router;
