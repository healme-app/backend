/** @format */

import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import User from "../models/user";
import { signup, login, updateProfile } from "../controllers/auth";
import isAuth from "../middleware/is-auth";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists.");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("username").trim().not().isEmpty(),
  ],
  signup
);

router.post("/login", login);

router.put(
  "/profile",
  [
    body("username")
      .optional()
      .trim()
      .not()
      .isEmpty()
      .withMessage("Username cannot be empty."),
    body("age")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Please enter a valid age."),
    body("gender")
      .optional()
      .isString()
      .isIn(["male", "female", "other"])
      .withMessage("Please enter a valid gender."),
  ],
  isAuth,
  updateProfile
);

router.get(
  "/profile",
  isAuth,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;

    if (!userId) {
      const error = new Error("User not authenticated.");
      (error as any).statusCode = 401;
      throw error;
    }

    User.findById(userId)
      .then((user) => {
        if (!user) {
          const error = new Error("User not found.");
          (error as any).statusCode = 404;
          throw error;
        }

        let message = "User information retrieved successfully.";
        if (user.age === undefined || user.gender === undefined) {
          message =
            "User information retrieved successfully. Please update your profile.";
        }

        res.status(200).json({
          message: message,
          user: user,
        });
      })
      .catch((err) => {
        if (!(err as any).statusCode) {
          (err as any).statusCode = 500;
        }
        next(err);
      });
  }
);

export default router;
