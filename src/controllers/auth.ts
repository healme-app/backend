/** @format */

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const signup = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        username: username,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created!",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser: any;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error: any = new Error(
          "A user with this email could not be found."
        );
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error: any = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        "testing", //C241PS458
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

interface CustomRequest extends Request {
  userId?: string;
}

export const updateProfile = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const { age, gender, username } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        (error as any).statusCode = 404;
        throw error;
      }

      if (username) {
        user.username = username;
      }
      if (age !== undefined) {
        user.age = age;
      }
      if (gender) {
        user.gender = gender;
      }

      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "User profile updated!",
        user: result,
      });
    })
    .catch((err) => {
      if (!(err as any).statusCode) {
        (err as any).statusCode = 500;
      }
      next(err);
    });
};
