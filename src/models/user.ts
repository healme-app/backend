/** @format */

import mongoose, { Document, Schema, Model } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  dateOfBirth: Date;
  age: number | null;
  gender: "male" | "female" | "other";
  weight: number;
  results?: mongoose.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  results: [{ type: Schema.Types.ObjectId, ref: "Result" }],
});

userSchema.pre<IUser>("save", function (next) {
  if (this.dateOfBirth) {
    const now = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    this.age = age;
  }
  next();
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
