/** @format */

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

interface CustomRequest extends Request {
  userId?: string;
}

export const signup = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, username, password, dateOfBirth, weight, gender } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        username: username,
        dateOfBirth: dateOfBirth,
        weight: weight,
        gender: gender,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ error: false, message: "User created!", userId: result._id });
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
        "C241PS458",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        error: false,
        message: "success",
        loginResult: { userId: loadedUser._id.toString(), token: token },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const updateProfile = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const { dateOfBirth, gender, username, weight } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error: any = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      // Update user fields
      if (username !== undefined) {
        if (username.length > 20) {
          const error: any = new Error(
            "Username must be no longer than 20 characters."
          );
          error.statusCode = 422;
          throw error;
        }
        user.username = username;
      }
      if (dateOfBirth) {
        user.dateOfBirth = dateOfBirth;

        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        user.age = age;
      }
      if (gender) {
        user.gender = gender;
      }
      if (weight !== undefined) {
        user.weight = weight;
      }

      return user.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ error: false, message: "User profile updated!", user: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
