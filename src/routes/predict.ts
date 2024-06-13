/** @format */

import express from "express";
import {
  getResults,
  createResult,
  getResult,
  deleteResult,
} from "../controllers/predict";
import isAuth from "../middleware/is-auth";
import imgUpload from "../modules/uploadImages";

const router = express.Router();

// GET /predict/results
router.get("/results", isAuth, getResults);

// POST /predict/result
router.post("/result", isAuth, imgUpload.uploadToGcs, createResult);

// GET /predict/result/resultId
router.get("/result/:resultId", isAuth, getResult);

// DELETE /predict/result/resultId
router.delete("/result/:resultId", isAuth, deleteResult);

export default router;
